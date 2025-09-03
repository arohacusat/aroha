document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('sheetdb-form');
            const successAlert = document.getElementById('success-alert');
            const errorAlert = document.getElementById('error-alert');
            const errorMessage = document.getElementById('error-message');
            const statusMessage = document.getElementById('status-message');
            const buttonText = document.getElementById('button-text');
            const buttonSpinner = document.getElementById('button-spinner');
            
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                buttonText.textContent = 'Sending...';
                buttonSpinner.style.display = 'inline-block';
                statusMessage.textContent = 'Submitting your form...';
                statusMessage.style.color = '#ffc107';
                
                // Hide any previous alerts
                successAlert.style.display = 'none';
                errorAlert.style.display = 'none';
                
                try {
                    // Create URLSearchParams from form data
                    const formData = new URLSearchParams();
                    formData.append('data[Name]', document.getElementById('name').value);
                    formData.append('data[Email]', document.getElementById('email').value);
                    formData.append('data[Subject]', document.getElementById('subject').value);
                    formData.append('data[Message]', document.getElementById('message').value);
                    
                    const response = await fetch('https://sheetdb.io/api/v1/fuhinmcu6mjm3', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData.toString()
                    });
                    
                    // Check if response is OK without trying to parse as JSON first
                    if (response.ok) {
                        // Try to parse as JSON, but if it fails, still consider it a success
                        try {
                            const result = await response.json();
                            console.log('Success:', result);
                        } catch (jsonError) {
                            console.log('Success (non-JSON response):', response.status, response.statusText);
                        }
                        
                        // Show success message
                        successAlert.style.display = 'block';
                        statusMessage.textContent = 'Form submitted successfully!';
                        statusMessage.style.color = '#28a745';
                        
                        // Create confetti effect
                        createConfetti();
                        
                        // Reset form
                        form.reset();
                    } else {
                        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    
                    // Show error message
                    errorMessage.textContent = error.message || 'There was an error submitting your form. Please try again.';
                    errorAlert.style.display = 'block';
                    statusMessage.textContent = 'Error: ' + error.message;
                    statusMessage.style.color = '#dc3545';
                    
                    // Try alternative approach with JSON if the first method fails
                    if (error.message.includes('CORS') || error.message.includes('Network')) {
                        statusMessage.textContent = 'Trying alternative method...';
                        
                        try {
                            const jsonData = {
                                data: {
                                    Name: document.getElementById('name').value,
                                    Email: document.getElementById('email').value,
                                    Subject: document.getElementById('subject').value,
                                    Message: document.getElementById('message').value
                                }
                            };
                            
                            const response = await fetch('https://sheetdb.io/api/v1/fuhinmcu6mjm3', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(jsonData)
                            });
                            
                            if (response.ok) {
                                successAlert.style.display = 'block';
                                statusMessage.textContent = 'Form submitted successfully!';
                                statusMessage.style.color = '#28a745';
                                form.reset();
                                
                                // Create confetti effect
                                createConfetti();
                            } else {
                                throw new Error(`Alternative method failed: ${response.status}`);
                            }
                        } catch (fallbackError) {
                            console.error('Fallback error:', fallbackError);
                            errorMessage.textContent = 'Both methods failed. Please try again later.';
                        }
                    }
                } finally {
                    // Reset button state
                    submitBtn.disabled = false;
                    buttonText.textContent = 'Send Message';
                    buttonSpinner.style.display = 'none';
                }
            });
            
            // Function to create confetti effect
            function createConfetti() {
                const confettiCount = 100;
                const container = document.body;
                
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    
                    // Random colors
                    const colors = ['#ffc107', '#dc3545', '#28a745', '#17a2b8', '#6f42c1'];
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.backgroundColor = color;
                    
                    // Random size
                    const size = Math.random() * 10 + 5;
                    confetti.style.width = `${size}px`;
                    confetti.style.height = `${size}px`;
                    
                    // Random position
                    confetti.style.left = `${Math.random() * 100}vw`;
                    
                    // Random animation delay
                    confetti.style.animationDelay = `${Math.random() * 2}s`;
                    
                    container.appendChild(confetti);
                    
                    // Remove confetti after animation completes
                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }
            }
        });
