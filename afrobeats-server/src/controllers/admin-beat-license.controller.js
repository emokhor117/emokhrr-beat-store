import {
  upsertBeatLicenses,
} from '../services/admin-beat-license.service.js'

export async function upsertBeatLicensesController(
  req,
  res
) {
  try {
    const result =
      await upsertBeatLicenses({
        beatPublicId:
          req.params.beatId,

        licenses:
          req.body?.licenses,
      })

    return res.status(200).json({
      success: true,
      message:
        'Beat licenses updated successfully',
      licenses: result,
    })
  } catch (error) {
    console.error(
      'Beat license update failed:',
      error
    )

    if (
      error.message ===
      'BEAT_NOT_FOUND'
    ) {
      return res.status(404).json({
        success: false,
        message: 'Beat not found',
      })
    }

    if (
      error.message ===
      'INVALID_LICENSE_DATA'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid license data',
      })
    }

    if (
      error.message ===
      'LICENSE_TYPE_NOT_FOUND'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'One or more license types do not exist',
      })
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to update beat licenses',
    })
  }
}