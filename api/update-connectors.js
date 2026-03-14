export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  
    const { connectors } = req.body
  
    const token = process.env.GITHUB_TOKEN
    const owner = 'YOUR_GITHUB_USERNAME'   // ← fill this in
    const repo  = 'YOUR_REPO_NAME'         // ← fill this in
    const path  = 'public/data.json'
  
    try {
      // Get current file SHA (required by GitHub API to update a file)
      const getRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
          },
        }
      )
      const fileData = await getRes.json()
  
      // Push updated file
      const content = Buffer.from(JSON.stringify(connectors, null, 2)).toString('base64')
  
      const updateRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'chore: update connector database',
            content,
            sha: fileData.sha,
          }),
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
  
