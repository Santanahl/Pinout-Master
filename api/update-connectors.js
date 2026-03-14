export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { connectors } = req.body

  const token = process.env.GITHUB_TOKEN
  const owner = 'Santanahl'
  const repo  = 'Pinout-Master'
  const path  = 'public/data.json'

  try {
    // Try to get current file SHA (needed to update an existing file)
    const getRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    )

    // If file exists grab its SHA, if not that's fine too
    let sha = undefined
    if (getRes.ok) {
      const fileData = await getRes.json()
      sha = fileData.sha
    }

    // Push updated file
    const content = Buffer.from(JSON.stringify(connectors, null, 2)).toString('base64')

    const body = {
      message: 'chore: update connector database',
      content,
    }

    // Only include SHA if the file already exists
    if (sha) body.sha = sha

    const updateRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    if (!updateRes.ok) {
      const err = await updateRes.json()
      throw new Error(err.message || 'GitHub API error')
    }

    res.status(200).json({ success: true })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
