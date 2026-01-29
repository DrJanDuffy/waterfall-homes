// Vercel Serverless Function for Follow Up Boss Lead Submission

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const leadData = req.body;

    // Validate required fields
    if (!leadData.emails || !leadData.emails[0]?.value) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Follow Up Boss API configuration
    const apiKey = process.env.FUB_API_KEY || 'fka_0N4mnN896yfdkNErKEwUjFmBsX5rEZNNCZ';
    const apiUrl = 'https://api.followupboss.com/v1/people';

    // Send data to Follow Up Boss
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Error submitting to Follow Up Boss');
    }

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Lead successfully submitted' 
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
}
