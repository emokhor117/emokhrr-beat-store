import {
  createBeat,
  updateBeat,
  listAdminBeats
} from '../services/admin-beat.service.js'

export async function createBeatController(
  req,
  res
) {
  try {
    const beat =
      await createBeat(req.body)

    return res.status(201).json({
      success: true,
      message: 'Beat created successfully',
      beat,
    })
  } catch (error) {
    console.error(
      'Beat creation failed:',
      error
    )

    if (
  error.message ===
    'BEAT_MUST_START_AS_DRAFT'
) {
  return res.status(409).json({
    success: false,
    message:
      'New beats must be created as drafts before publishing.',
  })
}

    if (
      error.message === 'INVALID_BEAT_DATA'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid beat information',
      })
    }

    if (
      error.message === 'BEAT_ALREADY_EXISTS'
    ) {
      return res.status(409).json({
        success: false,
        message:
          'A beat with this ID or slug already exists',
      })
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to create beat',
    })
  }
}

export async function listAdminBeatsController(
  req,
  res
) {
  try {
    const beats =
      await listAdminBeats()

    return res.status(200).json({
      success: true,
      beats,
    })
  } catch (error) {
    console.error(
      'Admin beat listing failed:',
      error
    )

    return res.status(500).json({
      success: false,
      message:
        'Failed to load beats',
    })
  }
}

export async function updateBeatController(
  req,
  res
) {
  try {
    const beat =
      await updateBeat({
        beatPublicId:
          req.params.beatId,
        updates: req.body,
      })

    return res.status(200).json({
      success: true,
      message: 'Beat updated successfully',
      beat,
    })
  } catch (error) {
    console.error(
      'Beat update failed:',
      error
    )

    if (
      error.message === 'BEAT_NOT_FOUND'
    ) {
      return res.status(404).json({
        success: false,
        message: 'Beat not found',
      })
    }

    if (
  error.message ===
    'BEAT_MISSING_ARTWORK'
) {
  return res.status(409).json({
    success: false,
    message:
      'Upload artwork before publishing this beat.',
  })
}

if (
  error.message ===
    'BEAT_MISSING_PREVIEW'
) {
  return res.status(409).json({
    success: false,
    message:
      'Upload a mastered tagged preview before publishing this beat.',
  })
}

if (
  error.message ===
    'BEAT_HAS_NO_LICENSES'
) {
  return res.status(409).json({
    success: false,
    message:
      'Configure at least one license before publishing this beat.',
  })
}

if (
  error.message ===
    'BEAT_HAS_NO_DELIVERABLE_LICENSE'
) {
  return res.status(409).json({
    success: false,
    message:
      'At least one license must have all required deliverable files before publishing.',
  })
}

    if (
      error.message === 'INVALID_BEAT_DATA'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid beat information',
      })
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to update beat',
    })
  }
}