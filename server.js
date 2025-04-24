const express = require('express');
const app = express();
const PORT = 7000;
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const jobRoutes = require('./routes/jobRoutes'); // Import job routes
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const profileManageRoutes = require('./routes/profileManageRoutes'); // Import p
const companyRoutes = require('./routes/companyRoutes'); // Import company routes
const authenticateUser = require('./middleware/authMiddleware'); 
const pool = require('./config/db'); // Import database connection
const upload = require('./utils/multer'); // Import multer middleware
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use('/auth', authRoutes); // Ensure auth routes are used
app.use('/jobs', authenticateUser, jobRoutes);
app.use('/admin', authenticateUser, adminRoutes); 
app.use('/profile', authenticateUser, profileManageRoutes); 
app.use('/company', authenticateUser, companyRoutes); 

// Database connection
pool.getConnection((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});