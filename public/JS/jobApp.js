document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section'); // All sections in the page
    const navLinks = document.querySelectorAll('.navbar ul li a'); // Navbar links

    // Function to hide all sections
    const hideAllSections = () => {
        sections.forEach(section => {
            section.style.display = 'none';
        });
    };

    // Function to show the selected section
    const showSection = (sectionId) => {
        hideAllSections(); // Hide all sections first
        const section = document.querySelector(sectionId); // Find the section by ID
        if (section) {
            section.style.display = 'block'; // Show the selected section
            console.log(`Showing section: ${sectionId}`);
        } else {
            console.log(`Section not found: ${sectionId}`);
        }
    };

    // Add click event listeners to navbar links
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            const targetSection = link.getAttribute('href'); // Get the href attribute (section ID)

            // If it starts with '#' (indicating a section ID), show the section
            if (targetSection.startsWith('#')) {
                showSection(targetSection);
            } else if (targetSection === '/auth/logout') {
                // For logout or external links, redirect to the URL
                window.location.href = targetSection;
            }
        });
    });

    // Initially show the first section in the navbar
    if (navLinks.length > 0) {
        const defaultSection = navLinks[0].getAttribute('href'); // Get the first link's href
        if (defaultSection.startsWith('#')) {
            showSection(defaultSection); // Show the default section
        }
    }
});
