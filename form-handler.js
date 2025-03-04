document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('fub-contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');
    
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    async function handleSubmit(event) {
        event.preventDefault();
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Get form data
        const formData = new FormData(form);
        const leadData = {
            firstName: formData.get('name').split(' ')[0],
            lastName: formData.get('name').split(' ').slice(1).join(' ') || '',
            emails: [{ value: formData.get('email') }],
            phones: [{ value: formData.get('phone') }],
            source: formData.get('leadSource') || 'website',
            sourceUrl: window.location.href,
            note: formData.get('message'),
            tags: ["Waterfall Homes", "Website Lead"]
        };
        
        try {
            // Use a serverless function to handle API request
            const response = await fetch('/.netlify/functions/submit-to-fub', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Success
                formStatus.innerHTML = '<p class="success-message">Thank you for your message! We will be in touch soon.</p>';
                formStatus.classList.remove('hidden');
                form.reset();
            } else {
                // Error from serverless function
                throw new Error(result.message || 'There was a problem submitting your form. Please try again.');
            }
        } catch (error) {
            // Display error message
            formStatus.innerHTML = `<p class="error-message">${error.message}</p>`;
            formStatus.classList.remove('hidden');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    }
});
