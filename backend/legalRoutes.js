/**
 * Legal Content API Routes
 * Add these routes to your Express backend to fix "route not found" when saving Privacy Policy / Legal Content.
 *
 * In your main server file (e.g. server.js or app.js):
 *   const legalRoutes = require('./backend/legalRoutes');  // or path to this file
 *   app.use('/api/legal', legalRoutes);
 *
 * Ensure this runs AFTER any general /api router so /api/legal is hit first.
 */

const express = require('express');
const router = express.Router();

const VALID_TYPES = ['privacyPolicy', 'termsOfService', 'cookiePolicy', 'aboutUs'];

// In-memory store (replace with your database in production)
const store = {
  privacyPolicy: { content: '', lastUpdated: null },
  termsOfService: { content: '', lastUpdated: null },
  cookiePolicy: { content: '', lastUpdated: null },
  aboutUs: { content: '', lastUpdated: null },
};

// GET /api/legal - get all legal content
router.get('/', (req, res) => {
  try {
    res.json({
      privacyPolicy: store.privacyPolicy,
      termsOfService: store.termsOfService,
      cookiePolicy: store.cookiePolicy,
      aboutUs: store.aboutUs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch legal content',
    });
  }
});

// GET /api/legal/:type - get one type
router.get('/:type', (req, res) => {
  const { type } = req.params;
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }
  res.json(store[type]);
});

// PUT /api/legal/:type - update one type (used when saving Privacy Policy, etc.)
router.put('/:type', (req, res) => {
  const { type } = req.params;
  const { content } = req.body || {};

  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
    });
  }

  if (content === undefined || content === null) {
    return res.status(400).json({
      success: false,
      message: 'Request body must include "content"',
    });
  }

  const now = new Date().toISOString();
  store[type] = {
    content: String(content),
    lastUpdated: now,
  };

  res.json({
    success: true,
    data: {
      type,
      content: store[type].content,
      lastUpdated: store[type].lastUpdated,
    },
    message: 'Legal content updated successfully',
  });
});

// POST /api/legal - create (optional)
router.post('/', (req, res) => {
  const { type, content } = req.body || {};
  if (!type || !VALID_TYPES.includes(type)) {
    return res.status(400).json({
      success: false,
      message: `Body must include "type" (one of: ${VALID_TYPES.join(', ')})`,
    });
  }
  const now = new Date().toISOString();
  store[type] = {
    content: content != null ? String(content) : '',
    lastUpdated: now,
  };
  res.status(201).json({
    success: true,
    data: store[type],
    message: 'Legal content created successfully',
  });
});

module.exports = router;
