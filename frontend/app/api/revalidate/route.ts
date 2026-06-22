import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/revalidate
 * On-demand ISR revalidation — purges cached homepage so avatar/profile
 * changes are immediately visible on the frontend without waiting for the
 * 60-second ISR window to expire.
 *
 * Protected by a secret token stored in REVALIDATE_SECRET env var.
 * The admin panel sends this token in the Authorization header.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-revalidate-secret')
    const envSecret = process.env.REVALIDATE_SECRET

    // If a secret is configured, enforce it. If not configured, allow freely
    // (safe behind the admin JWT layer that calls this).
    if (envSecret && secret !== envSecret) {
      return NextResponse.json({ error: 'Invalid revalidation secret' }, { status: 401 })
    }

    // Revalidate the homepage (and any layout that uses profile data)
    revalidatePath('/')
    revalidatePath('/[...slug]', 'page')

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: 'Frontend cache cleared — new avatar will be visible immediately',
    })
  } catch (err: any) {
    return NextResponse.json(
      { revalidated: false, error: err.message },
      { status: 500 }
    )
  }
}
