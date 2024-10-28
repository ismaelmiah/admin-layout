// Menu data structure
const menuItems = [
    {
        id: 'dashboard',
        icon: 'fas fa-home',
        text: 'Dashboard',
        link: '#',
        children: null,
        isActive: false
    },
    {
        id: 'user-management',
        icon: 'fas fa-users',
        text: 'User Management',
        link: '#',
        children: [
            { id: 'all-users', text: 'All Users', link: '#', isActive: false },
            { id: 'add-user', text: 'Add User', link: '#', isActive: false },
            { id: 'user-roles', text: 'User Roles', link: '#', isActive: false }
        ],
        isActive: false
    },
    {
        id: 'settings',
        icon: 'fas fa-cog',
        text: 'Settings',
        link: '#',
        children: [
            { id: 'general', text: 'General', link: '#', isActive: false },
            { id: 'security', text: 'Security', link: '#', isActive: false },
            { id: 'preferences', text: 'Preferences', link: '#', isActive: false }
        ],
        isActive: false
    },
    {
        id: 'reports',
        icon: 'fas fa-chart-bar',
        text: 'Reports',
        link: '#',
        children: null,
        isActive: false
    }
];

// Function to generate menu HTML
function generateMenu() {
    const mainMenu = document.getElementById('main-menu');
    const submenuContainer = document.getElementById('submenu-container');

    menuItems.forEach(item => {
        // Create main menu item
        const li = document.createElement('li');
        // Only add menu-li class if it doesn't have children
        li.className = `${item.children ? 'parent-li' : 'menu-li'}`;
        li.setAttribute('data-menu-id', item.id);
        if (item.children) {
            li.setAttribute('data-submenu', item.id);
        }
        
        li.innerHTML = `
            <i class="${item.icon}"></i>
            <span>${item.text}</span>
        `;
        mainMenu.appendChild(li);

        // Create submenu if it exists
        if (item.children) {
            const submenuPanel = document.createElement('div');
            submenuPanel.className = 'submenu-panel';
            submenuPanel.id = item.id;

            submenuPanel.innerHTML = `
                <div class="submenu-header">
                        <h3>${item.text}</h3>
                        <button class="close-submenu"><i class="fas fa-times"></i></button>
                </div>
                <ul>
                    ${item.children.map(child => `
                        <li class="submenu-li" 
                            data-parent-id="${item.id}"
                            data-menu-id="${child.id}">
                            <span>${child.text}</span>
                        </li>
                    `).join('')}
                </ul>
            `;

            submenuContainer.appendChild(submenuPanel);
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    generateMenu();

    // Add content area for dashboard
    const contentArea = document.createElement('div');
    contentArea.id = 'dashboard-content';
    document.body.appendChild(contentArea);

    // Update click handlers
    document.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.menu-li, .submenu-li');
        if (menuItem) {
            e.preventDefault();

            // Remove all active states
            document.querySelectorAll('.menu-li, .submenu-li, .parent-li').forEach(item => {
                item.classList.remove('active');
            });

            // Add active state to clicked item
            menuItem.classList.add('active');

            // If it's a submenu item, highlight its parent (but don't make it active)
            if (menuItem.classList.contains('submenu-li')) {
                const parentId = menuItem.getAttribute('data-parent-id');
                const parentMenu = document.querySelector(`.parent-li[data-menu-id="${parentId}"]`);
                if (parentMenu) {
                    parentMenu.classList.add('active');
                }
            }

            // Update dashboard content
            const menuText = menuItem.querySelector('span').textContent.trim();
            updateDashboardContent(menuText);
        }
    });

    // Update submenu click handler
    const menuItems = document.querySelectorAll('[data-submenu]');
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const submenuId = item.getAttribute('data-submenu');
            const submenu = document.getElementById(submenuId);

            // Close all other submenus
            document.querySelectorAll('.submenu-panel').forEach(panel => {
                if (panel.id !== submenuId) {
                    panel.classList.remove('active');
                }
            });

            // Get the clicked item's position
            const rect = item.getBoundingClientRect();
            const centerY = rect.top + (rect.height / 2) - 100;
            submenu.style.top = `${centerY}px`;

            // Toggle current submenu
            submenu.classList.toggle('active');
        });
    });

    // Add window resize handler to reposition active submenus
    window.addEventListener('resize', () => {
        const activeSubmenu = document.querySelector('.submenu-panel.active');
        if (activeSubmenu) {
            const menuItem = document.querySelector(`[data-submenu="${activeSubmenu.id}"]`);
            const rect = menuItem.getBoundingClientRect();
            const centerY = rect.top + (rect.height / 2);
            activeSubmenu.style.top = `${centerY}px`;
        }
    });

    // Handle close button clicks
    const closeButtons = document.querySelectorAll('.close-submenu');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.submenu-panel').classList.remove('active');
        });
    });

    // Close submenu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.submenu-panel') &&
            !e.target.closest('[data-submenu]')) {
            document.querySelectorAll('.submenu-panel').forEach(panel => {
                panel.classList.remove('active');
            });
        }
    });

});
