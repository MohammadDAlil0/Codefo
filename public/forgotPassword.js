const html = `<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
      font-size: 24px;
      margin-top: 0;
    }
    p {
      color: #666666;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 20px;
    }
    .btn:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Forgot Your Password?</h1>
    <p>Don't worry, it happens to the best of us. Let's get you back on track!</p>
    <p>Submit a PATCH request with a new password and confirm password to reset your password.</p>
    <p>To reset your password, click the button below:</p>
    <p>
      <a class="btn" href={{resetURL}}>Reset Password</a>
    </p>
    <p>If you didn't forget your password, please ignore this email.</p>
    <p>Thanks,<br>${process.env.EMAIL_FROM_NAME}</p>
  </div>
</body>
</html>`

module.exports = html;