function updateAccountUI() {
    const username = localStorage.getItem('username');
    const dropdown = document.getElementById('accountDropdown');
    if (!dropdown) return;
    if (username) {
        dropdown.innerHTML = `
            <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">${username}</button>
            <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item" type="button" onclick="logout()">Logout</button>
            </div>
        `;
    } else {
        dropdown.innerHTML = `
            <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">My Account</button>
            <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item" type="button" data-toggle="modal" data-target="#signInModal">Sign in</button>
                <button class="dropdown-item" type="button" data-toggle="modal" data-target="#signUpModal">Sign up</button>
            </div>
        `;
    }
}

function logout() {
    localStorage.removeItem('username');
    updateAccountUI();

}

document.addEventListener('DOMContentLoaded', function() {
    updateAccountUI();
});