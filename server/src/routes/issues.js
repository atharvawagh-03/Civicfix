import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Issue } from '../models/Issue.js';
import { User } from '../models/User.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|gif|webp)$/i.test(file.mimetype);
    if (!ok) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

const router = Router();

function publicImageUrl(req, filename) {
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
}

router.post('/issue', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'citizen') {
      return res.status(403).json({ message: 'Only citizens can report issues' });
    }
    const { title, description, latitude, longitude } = req.body;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!title || !description || !req.file || Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({
        message: 'Title, description, image, latitude, and longitude are required',
      });
    }
    const image = publicImageUrl(req, req.file.filename);
    const issue = await Issue.create({
      title,
      description,
      image,
      location: { latitude: lat, longitude: lng },
      createdBy: req.user.id,
      statusHistory: [{ status: 'pending', at: new Date(), by: req.user.id }],
    });
    await issue.populate('createdBy', 'name email userId');
    return res.status(201).json(formatIssue(issue));
  } catch (e) {
    if (e.message === 'Only image files are allowed') {
      return res.status(400).json({ message: e.message });
    }
    return res.status(500).json({ message: e.message || 'Failed to create issue' });
  }
});

router.get('/issues', requireAuth, async (req, res) => {
  try {
    const { status, mine } = req.query;
    const filter = {};
    if (req.user.role === 'citizen' || mine === 'true') {
      filter.createdBy = req.user.id;
    }
    if (status && ['pending', 'in_progress', 'resolved'].includes(status)) {
      filter.status = status;
    }
    const issues = await Issue.find(filter)
      .sort({ updatedAt: -1 })
      .populate('createdBy', 'name email userId')
      .populate('assignedTo', 'name email userId')
      .lean();
    return res.json(issues.map(formatIssueLean));
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to list issues' });
  }
});

router.get('/issue/:id', requireAuth, async (req, res) => {
  try {
    const issue = await Issue.findOne({
      $or: [{ _id: req.params.id }, { issueId: req.params.id }],
    })
      .populate('createdBy', 'name email userId')
      .populate('assignedTo', 'name email userId')
      .populate('comments.userId', 'name email userId')
      .populate('statusHistory.by', 'name email userId');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (req.user.role === 'citizen' && issue.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    return res.json(formatIssue(issue));
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to load issue' });
  }
});

router.put('/issue/:id', requireAuth, async (req, res) => {
  try {
    const issue = await Issue.findOne({
      $or: [{ _id: req.params.id }, { issueId: req.params.id }],
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (req.user.role === 'citizen') {
      if (issue.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { title, description } = req.body;
      if (title) issue.title = title;
      if (description) issue.description = description;
      issue.updatedAt = new Date();
      await issue.save();
      await issue.populate('createdBy', 'name email userId');
      await issue.populate('assignedTo', 'name email userId');
      return res.json(formatIssue(issue));
    }

    const { status, assignedTo, comment } = req.body;
    if (status && ['pending', 'in_progress', 'resolved'].includes(status)) {
      if (issue.status !== status) {
        issue.status = status;
        issue.statusHistory.push({
          status,
          at: new Date(),
          by: req.user.id,
          note: comment || undefined,
        });
      }
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'assignedTo')) {
      const v = req.body.assignedTo;
      if (v === null || v === undefined || v === '') {
        issue.assignedTo = null;
      } else {
        const assignee = await User.findById(v);
        if (!assignee || assignee.role !== 'admin') {
          return res.status(400).json({ message: 'Assignee must be an admin user' });
        }
        issue.assignedTo = v;
      }
    }
    if (comment && comment.trim()) {
      issue.comments.push({ userId: req.user.id, text: comment.trim() });
    }
    issue.updatedAt = new Date();
    await issue.save();
    await issue.populate('createdBy', 'name email userId');
    await issue.populate('assignedTo', 'name email userId');
    await issue.populate('comments.userId', 'name email userId');
    await issue.populate('statusHistory.by', 'name email userId');
    return res.json(formatIssue(issue));
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to update issue' });
  }
});

router.delete('/issue/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const issue = await Issue.findOneAndDelete({
      $or: [{ _id: req.params.id }, { issueId: req.params.id }],
    });
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    return res.json({ message: 'Issue deleted' });
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to delete issue' });
  }
});

router.get('/admin-users', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('userId name email')
      .lean();
    return res.json(admins);
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Failed to list admins' });
  }
});

router.get('/analytics', requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [total, byStatus, byMonth] = await Promise.all([
      Issue.countDocuments(),
      Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Issue.aggregate([
        {
          $group: {
            _id: {
              y: { $year: '$createdAt' },
              m: { $month: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.y': 1, '_id.m': 1 } },
        { $limit: 12 },
      ]),
    ]);
    const statusDistribution = { pending: 0, in_progress: 0, resolved: 0 };
    for (const row of byStatus) {
      if (row._id && statusDistribution[row._id] !== undefined) {
        statusDistribution[row._id] = row.count;
      }
    }
    return res.json({
      totalIssues: total,
      statusDistribution,
      monthly: byMonth.map((r) => ({
        year: r._id.y,
        month: r._id.m,
        count: r.count,
      })),
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || 'Analytics failed' });
  }
});

function formatIssue(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return formatIssueLean(o);
}

function formatIssueLean(o) {
  return {
    issueId: o.issueId || o._id?.toString(),
    title: o.title,
    description: o.description,
    image: o.image,
    location: o.location,
    status: o.status,
    createdBy: o.createdBy,
    assignedTo: o.assignedTo,
    comments: o.comments || [],
    statusHistory: o.statusHistory || [],
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export default router;
