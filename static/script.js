document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize particles.js
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4361ee"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4361ee",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#prediction-section' || this.id === 'showPredictionBtn') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Form elements
    const predictionForm = document.getElementById('predictionForm');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const initialMessageDiv = document.getElementById('initial-message');
    const errorMessageDiv = document.getElementById('error-message');
    
    // Results elements
    const particleSizeElement = document.getElementById('particle_size');
    const pdiElement = document.getElementById('pdi');
    const eeElement = document.getElementById('ee');
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resultsDiv.classList.add('d-none');
            initialMessageDiv.classList.remove('d-none');
            predictionForm.reset();
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Create CSV content
            const csvContent = [
                "Parameter,Value",
                `P.BOYUTU (nm),${particleSizeElement.textContent}`,
                `PDI,${pdiElement.textContent}`,
                `EE (%),${eeElement.textContent}`
            ].join("\n");
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "lipozom_tahmin_sonuclari.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show success message (in a real app, you would send the form data to a server)
            const formElements = contactForm.elements;
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = true;
            }
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.';
            
            contactForm.appendChild(successMessage);
            
            // Reset form after 3 seconds
            setTimeout(function() {
                contactForm.reset();
                successMessage.remove();
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].disabled = false;
                }
            }, 3000);
        });
    }
    
    // Prediction form submission
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide initial message and show loading
            initialMessageDiv.classList.add('d-none');
            errorMessageDiv.classList.add('d-none');
            resultsDiv.classList.add('d-none');
            loadingDiv.classList.remove('d-none');
            
            // Get form values
            const lipid_s100 = document.getElementById('lipid_s100').value;
            const dspe = document.getElementById('dspe').value;
            const dope = document.getElementById('dope').value;
            const cholesterol = document.getElementById('cholesterol').value;
            const em = document.getElementById('em').value;
            const hydration = document.getElementById('hydration').value;
            const solvent_type = document.getElementById('solvent_type').value;
            
            // Prepare data for API call
            const data = {
                lipid_s100: parseFloat(lipid_s100),
                dspe: parseFloat(dspe),
                dope: parseFloat(dope),
                cholesterol: parseFloat(cholesterol),
                em: parseFloat(em),
                hydration: parseFloat(hydration),
                solvent_type: parseInt(solvent_type)
            };
            
            // Make actual API call to the server
            fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(response => {
                // Update results
                document.getElementById('particle_size').textContent = "0.00";
                document.getElementById('pdi').textContent = response.pdi.toFixed(3);
                document.getElementById('ee').textContent = "0.00";
                
                // Hide loading and show results
                loadingDiv.classList.add('d-none');
                resultsDiv.classList.remove('d-none');
                
                // Animate the result values (PDI hariç)
                animateValue('particle_size', 0, parseFloat(response.particle_size), 1500);
                animateValue('ee', 0, parseFloat(response.ee), 1500);
            })
            .catch(error => {
                // Show error message
                loadingDiv.classList.add('d-none');
                errorMessageDiv.classList.remove('d-none');
                console.error('Error:', error);
            });
        });
    }
});

// Function to animate counting for result values
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = end - (remaining * range);
        
        // Format based on the type of value
        if (id === 'pdi') {
            obj.textContent = value.toFixed(3);
        } else {
            obj.textContent = value.toFixed(2);
        }
        
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
} 