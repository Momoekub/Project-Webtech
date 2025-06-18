// เปิด modal ลืมรหัสผ่าน
function openForgotPasswordModal() {
  $('#signInModal').modal('hide');
  $('#forgotPasswordModal').modal('show');
}

// ลืมรหัสผ่าน
function forgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  if (!email || !newPassword) {
    alert("กรุณากรอกอีเมลและรหัสผ่านใหม่");
    return;
  }

  fetch('http://localhost:5000/api/account/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว");
      $('#forgotPasswordModal').modal('hide');
      $('#signInModal').modal('show');
    } else {
      alert(data.message);
    }
  });
}

// สมัครสมาชิก
function signUp(event) {
  event.preventDefault();       
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  fetch('http://localhost:5000/api/account/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })  
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', 'user'); // สมัครใหม่เป็น user เสมอ
      updateAccountUI();
      $('#signUpModal').modal('hide');
      alert("สมัครสมาชิกสำเร็จ");
    } else {
      alert("สมัครไม่สำเร็จ: " + data.message);
    }
  });
}

// ล็อกอิน
function signIn(event) {
  event.preventDefault(); 
  const email = document.getElementById('signinEmail').value; 
  const password = document.getElementById('signinPassword').value;

  fetch('http://localhost:5000/api/account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role); // เก็บ role ด้วย
      updateAccountUI();
      $('#signInModal').modal('hide');
      alert("ล็อกอินสำเร็จ");
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      const err = document.getElementById('loginError');
      if (err) err.innerText = data.message || "Login failed";
    }
  });
}

// เปลี่ยนชื่อผู้ใช้
function changeUsername(event) {
  event.preventDefault();

  const newUsername = document.getElementById('newUsername').value.trim();
  const email = document.getElementById('changeEmail').value.trim();

  if (!newUsername || !email) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  fetch('http://localhost:5000/api/account/change-username', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newUsername })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("เปลี่ยนชื่อผู้ใช้สำเร็จเป็น: " + newUsername);
      localStorage.setItem('username', newUsername);
      updateAccountUI();
      $('#changeUsernameModal').modal('hide');
    } else {
      alert(data.message || "เปลี่ยนชื่อผู้ใช้ไม่สำเร็จ");
    }
  })
  .catch(err => {
    alert("เกิดข้อผิดพลาด: " + err.message);
  });
}

// เปิด modal เปลี่ยนชื่อผู้ใช้
function openChangeUsernameModal() {
  $('#changeUsernameModal').modal('show');
}

// อัปเดต UI เมื่อผู้ใช้ล็อกอิน
function updateAccountUI() {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const dropdown = document.getElementById('accountDropdown');
  if (!dropdown) return;
  let adminTab = '';
  if (role === 'admin') {
    adminTab = `<button class="dropdown-item" type="button" onclick="openAdminPanel()">หลังบ้าน (Admin)</button>`;
  }
  if (username) {
    dropdown.innerHTML = `
      <button type="button" class="btn btn-sm btn-light dropdown-toggle" data-toggle="dropdown">${username}</button>
      <div class="dropdown-menu dropdown-menu-right">
        ${adminTab}
        <button class="dropdown-item" type="button" onclick="openChangeUsernameModal()">เปลี่ยนชื่อผู้ใช้</button>
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

// ออกจากระบบ
function logout() {
  localStorage.removeItem('username');
  localStorage.removeItem('role'); // ลบ role ด้วย
  updateAccountUI();
}

// อัปเดต UI เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', function () {
  updateAccountUI();
});

function requestOTP() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email) return alert("กรอกอีเมลก่อน");

  fetch('http://localhost:5000/api/account/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("OTP ของคุณคือ: " + data.otp); // *แสดงใน alert จำลอง email*
    } else {
      alert(data.message);
    }
  });
}

function verifyOTPAndReset(event) {
  event.preventDefault();

  const email = document.getElementById('forgotEmail').value.trim();
  const otp = document.getElementById('otp').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  if (!email || !otp || !newPassword) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  fetch('http://localhost:5000/api/account/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("รีเซ็ตรหัสผ่านสำเร็จ");
      $('#forgotPasswordModal').modal('hide');
      $('#signInModal').modal('show');
    } else {
      alert(data.message);
    }
  });
}

// ฟังก์ชันเปิดหน้า admin (ตัวอย่าง)
function openAdminPanel() {
  window.location.href = "admin.html";
}