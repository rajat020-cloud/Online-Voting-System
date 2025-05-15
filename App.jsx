import React, { useState, useRef, useEffect, useCallback } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
    AppBar, Toolbar, Typography, Button, Card, CardContent,
    TextField, FormControl, InputLabel, Select, MenuItem,
    Radio, RadioGroup, FormControlLabel, CircularProgress,
    Container, Box, Stepper, Step, StepLabel, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Snackbar, Alert, Backdrop, Grid, IconButton,
    List, ListItem, ListItemText, ListItemIcon, Divider, CardMedia,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, // For User Management
    Switch, // For Config
    Accordion, AccordionSummary, AccordionDetails // For FAQ
} from '@mui/material';
import {
    Person, HowToVote, CheckCircle, CameraAlt, Home,
    Info, CheckBoxOutlineBlank, Assignment, Security, Lock,
    Close as CloseIcon, AdminPanelSettings, Assessment, PeopleAlt,
    Menu as MenuIcon, ArrowBack, PersonPin, Settings, Group, // Added Settings, Group
    ExpandMore as ExpandMoreIcon, HelpOutline // Added ExpandMore, HelpOutline
} from '@mui/icons-material';
import './index.css'; // MAKE SURE index.css IS IN THE SAME DIRECTORY (e.g., src/)
import Confetti from 'react-confetti';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    
} from 'chart.js';

// Register Chart.js components globally
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// ========================================================================
// --- Static Data Definitions (Replace with API calls in real app) ---
// ========================================================================
const CandidateSelection = ({ candidates }) => {
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  
    const handleChoose = (id) => {
      setSelectedCandidateId(id);
      console.log('Selected candidate:', id);
    };
  
    return (
      <Box className="candidate-container">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`candidate-card ${
              selectedCandidateId === candidate.id ? 'candidate-card-selected' : ''
            }`}
            sx={{ p: 2, m: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {candidate.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {candidate.description}
            </Typography>
  
            {selectedCandidateId === candidate.id ? (
              <CheckCircleIcon sx={{ color: '#66bb6a', fontSize: 32 }} />
            ) : (
              <Button
                variant="contained"
                onClick={() => handleChoose(candidate.id)}
                sx={{
                  background: 'linear-gradient(to right, #43cea2, #185a9d)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '2rem',
                  padding: '0.5rem 1.5rem',
                  '&:hover': {
                    background: 'linear-gradient(to right, #185a9d, #43cea2)',
                  },
                }}
              >
                Choose Candidate
              </Button>
            )}
          </Card>
        ))}
      </Box>
    );
  };
const staticElectionResults = {
    candidates: [
        { name: "Candidate1", votes: 1250, color: 'rgba(255, 159, 64, 0.7)' },
        { name: "Candidate2", votes: 980, color: 'rgba(54, 162, 235, 0.7)' },
        { name: "Candidate3", votes: 750, color: 'rgba(255, 206, 86, 0.7)' },
        { name: "Candidate4", votes: 320, color: 'rgba(75, 192, 192, 0.7)' },
        { name: "Candidate5", votes: 280, color: 'rgba(153, 102, 255, 0.7)' },
        { name: "Candidate6", votes: 150, color: 'rgba(255, 99, 132, 0.7)' },
    ],
    totalVotes: 3730,
};

const staticVotersList = [
    { id: 'V001', name: 'Aarav Sharma', timestamp: '2023-10-27 10:15:30' }, { id: 'V002', name: 'Diya Patel', timestamp: '2023-10-27 10:18:12' },
    { id: 'V003', name: 'Vihaan Singh', timestamp: '2023-10-27 10:25:05' }, { id: 'V004', name: 'Ananya Reddy', timestamp: '2023-10-27 10:31:45' },
    { id: 'V005', name: 'Advik Kumar', timestamp: '2023-10-27 10:33:59' }, { id: 'V006', name: 'Ishaan Nair', timestamp: '2023-10-27 10:40:11' },
    { id: 'V007', name: 'Myra Joshi', timestamp: '2023-10-27 10:42:30' }, { id: 'V008', name: 'Kabir Gupta', timestamp: '2023-10-27 10:50:01' },
    { id: 'V009', name: 'Saanvi Agarwal', timestamp: '2023-10-27 10:55:22'}, { id: 'V010', name: 'Reyansh Malhotra', timestamp: '2023-10-27 11:01:09'}
];

const staticCandidates = [
     { id: 1, name: "Candidate 1", image:"https://cdn1.vectorstock.com/i/1000x1000/31/95/user-sign-icon-person-symbol-human-avatar-vector-12693195.jpg" , bio: "Focusing on national development and strong governance." },
     { id: 2, name: "Candidate 2", image:"https://static.vecteezy.com/system/resources/thumbnails/006/487/917/small_2x/man-avatar-icon-free-vector.jpg", bio: "Advocating for social justice and inclusive policies." },
     { id: 3, name: "Candidate 3", image:"https://cdn-icons-png.flaticon.com/512/219/219970.png", bio: "Platform centered around anti-corruption and reforms." },
     { id: 4, name: "Candidate 4", image:"https://tse1.mm.bing.net/th/id/OIP.924pjAI6I-xPltZghzJ0WQHaHa?w=626&h=626&rs=1&pid=ImgDetMain", bio: "Student wing focused on national interest and education." },
     { id: 5, name: "Candidate 5", image:"https://tse2.mm.bing.net/th/id/OIP.004yQrsT7-RkWUIYrRlWWAHaHa?w=626&h=626&rs=1&pid=ImgDetMain", bio: "Student organization promoting student rights and democracy." },
     { id: 6, name: "Candidate 6", image:"https://img.freepik.com/premium-photo/male-female-profile-avatar-user-avatars-gender-icons_1020867-74858.jpg", bio: "Regional party advocating for the interests of Punjab." },
];

const staticInitialElectionConfig = {
    title: "Annual Student Body Election 2024",
    startDate: "2025-04-21",
    endDate: "2025-04-25",
    allowNewRegistrations: true,
    verificationRequired: true,
};

const staticManagedUsers = [
    { id: 'U001', name: 'Aarav Sharma', email: 'aarav.s@example.com', status: 'Active', canVote: true },
    { id: 'U002', name: 'Diya Patel', email: 'diya.p@example.com', status: 'Active', canVote: true },
    { id: 'U003', name: 'Vihaan Singh', email: 'vihaan.s@example.com', status: 'Inactive', canVote: false },
    { id: 'U004', name: 'Ananya Reddy', email: 'ananya.r@example.com', status: 'Active', canVote: true },
    { id: 'U005', name: 'Advik Kumar', email: 'advik.k@example.com', status: 'Active', canVote: true },
];

const staticFaqData = [
    { q: "Who is eligible to vote?", a: "All currently enrolled full-time students who have successfully registered and completed identity verification are eligible." },
    { q: "When can I vote?", a: "The voting period is from October 26, 2024, 09:00 AM IST to October 28, 2024, 05:00 PM IST." },
    { q: "Is my vote anonymous?", a: "Yes. While your identity is verified to ensure eligibility, your vote choice is recorded separately and kept confidential." },
    { q: "I'm having trouble with the webcam verification.", a: "Ensure you have granted camera permissions in your browser. Use a well-lit area and hold still. If problems persist, contact the election committee via the Help section." },
    { q: "Can I change my vote after submitting?", a: "No, once a vote is submitted, it cannot be changed or recalled to ensure the integrity of the election." },
];


// ========================================================================
// --- Reusable Component Definitions ---
// ========================================================================

// --- Enhanced Webcam Scanner --- (Keep definition from previous response)
const EnhancedWebcamScanner = ({ videoRef, scanning, verificationSuccess }) => {
    /* ... Same as previous definition ... */
    return (
        <div className="webcam-container">
            <video ref={videoRef} autoPlay playsInline muted className="webcam-video" style={{ transform: 'scaleX(-1)' }} />
            <div className="face-detection-corner corner-tl"></div><div className="face-detection-corner corner-tr"></div>
            <div className="face-detection-corner corner-bl"></div><div className="face-detection-corner corner-br"></div>
            {scanning && !verificationSuccess && ( <div className="scan-effect"> <div className="scan-line animate-scanner"></div> <div className="scan-status"> <CircularProgress size={24} color="inherit" className="mr-2" /> <Typography>Scanning...</Typography> </div> <div className="biometric-scan"> <div className="scan-grid"></div> <div className="facial-points"> {[...Array(8)].map((_, i) => <div key={i} className={`point point-${i + 1}`}></div>)} </div> </div> </div> )}
            {verificationSuccess && ( <div className="face-verified"> <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} /> </div> )}
        </div>
    );
};

// --- Enhanced Candidate Card --- (Keep definition from previous response)
const EnhancedCandidateCard = ({ candidate, selected, onSelect, image }) => {
    /* ... Same as previous definition ... */
     return (
        <Card className={`candidate-card ${selected ? 'candidate-card-selected' : ''}`} onClick={onSelect} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
            <CardContent className="text-center p-4">
                <div className="relative mb-4">
                    <Box className="candidate-avatar" sx={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem auto', overflow: 'hidden', border: '3px solid #eee', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={image} alt={candidate} className="candidate-image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                    {selected && ( <CheckCircle className="absolute -top-2 -right-2 text-2xl bg-white rounded-full shadow-md" sx={{ color: 'success.main', position: 'absolute', top: -8, right: -8 }} /> )}
                </div>
                <Typography variant="h6" className="font-bold"> {candidate} </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-3"> Political Party </Typography>
            </CardContent>
             <FormControlLabel value={candidate} control={ <Radio checked={selected} color="primary" /> } label="Select" className="mx-auto" sx={{ pb: 1, justifyContent: 'center', width: '100%' }} onClick={(e) => e.stopPropagation()} />
        </Card>
    );
};

// --- Vote Confirmation Component --- (Keep definition from previous response)
const VoteConfirmation = ({ userDetails, setCurrentStep }) => {
    /* ... Same as previous definition ... */
     return ( <Box className="text-center py-8"> <div className="relative inline-block"> <CheckCircle className="thank-you-icon" sx={{ fontSize: 100, color: 'success.main' }} /> <div className="vote-success-ripple"></div> </div> <Typography variant="h3" className="mb-4 font-bold" sx={{ color: '#3f51b5' }}> Thank You for Your Vote! </Typography> <Typography variant="h6" className="mb-8 animate-float"> Your vote has been successfully submitted. </Typography> <Paper elevation={3} sx={{ maxWidth: 450, margin: 'auto', padding: 3, textAlign: 'left', borderRadius: '1rem', background: '#f0f4f8' }}> <Typography variant="body1" className="mb-4 font-semibold"> Vote Receipt: </Typography> <Typography variant="body2" className="mb-2"> <strong>Voter Name:</strong> {userDetails.fullName || 'N/A'} </Typography> <Typography variant="body2" className="mb-2"> <strong>Voter ID:</strong> {userDetails.voterID || 'N/A'} </Typography> <Typography variant="body2" className="mb-2"> <strong>Date & Time:</strong> {new Date().toLocaleString()} </Typography> <Typography variant="body2" className="mb-2"> <strong>Confirmation ID:</strong> {Math.random().toString(36).substring(2, 12).toUpperCase()} </Typography> <Box className="mt-4 p-2 bg-green-50 rounded-lg border border-green-200 text-green-700 text-sm" sx={{ mt: 2, p: 1, borderRadius: 1, border: '1px solid', borderColor: 'success.main', bgcolor: 'success.light', color: 'success.dark', display: 'flex', alignItems: 'center', gap: 0.5 }}> <Lock sx={{ fontSize: 'inherit' }} /> Your vote is secure and anonymous. </Box> </Paper> <Button variant="contained" color="primary" onClick={() => setCurrentStep('welcome')} className="mt-6 px-6 py-2.5" sx={{ mt: 3, px: 3, py: 1.5 }} startIcon={<Home />}> Back to Home </Button> </Box> );
};

// --- Welcome Card Component --- (Keep definition from previous response)
const WelcomeCard = ({ icon: Icon, title, description }) => {
    /* ... Same as previous definition ... */
     return ( <Paper elevation={3} className="welcome-card" sx={{ textAlign: 'center', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}> <Box className="welcome-card-icon" sx={{ mb: 2, color: '#2ecc71', fontSize: '3rem', textAlign:'center' }}> <Icon fontSize="inherit" /> </Box> <Typography variant="h6" className="font-bold mb-2"> {title} </Typography> <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1}}> {description} </Typography> </Paper> );
};

// --- Admin Login Page Component --- (Keep definition from previous response)
const AdminLoginPage = ({ onLogin, loading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onLogin(email, password);
    };
  
    return (
      <Box
        className="auth-container"
        sx={{
          mt: 4,
          minHeight: '100vh',
          background: 'linear-gradient(to right, #2c3e50, #4ca1af)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          className="auth-paper"
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Box
            className="auth-header"
            sx={{
              textAlign: 'center',
              mb: 3,
              animation: 'fadeIn 1s ease-in-out',
            }}
          >
            <AdminPanelSettings
              className="auth-icon"
              sx={{ color: '#e74c3c', fontSize: 50, mb: 1 }}
            />
            <Typography
              variant="h5"
              className="auth-title"
              sx={{
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#e74c3c',
              }}
            >
              Admin Login
            </Typography>
          </Box>
  
          <form onSubmit={handleSubmit} className="auth-form">
    
          <TextField
  margin="dense"
  required
  fullWidth
  id="email"
  label="Admin Email"
  name="email"
  autoComplete="email"
  variant="standard"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputLabelProps={{
    shrink: true,  // Ensures the label stays in the position above the input field
    style: { 
      color: 'black' // Color of the label
    }
  }}
  InputProps={{
    style: { 
      color: 'black' // Color of the text inside the input
    }
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#888' },
      '&:hover fieldset': { borderColor: '#e74c3c' },
      '&.Mui-focused fieldset': { borderColor: '#e74c3c' },
    },
  }}
/>


          
            
            <TextField
              margin="dense"
              required
              fullWidth
              id="admin-password"
              name="admin-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: 'black' } }}
              InputProps={{
                style: { color: 'black' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#888' },
                  '&:hover fieldset': { borderColor: '#e74c3c' },
                  '&.Mui-focused fieldset': { borderColor: '#e74c3c' },
                },
              }}
            />
        
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-submit-button"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: 'bold',
                fontSize: '1rem',
                background: 'linear-gradient(to right, #e74c3c, #c0392b)',
                '&:hover': {
                  background: 'linear-gradient(to right, #c0392b, #922b21)',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>
        </Paper>
      </Box>
      
    );
  };
  

// --- Admin Results Page Component --- (Keep definition from previous response)
const AdminResultsPage = ({ onLogout }) => {
    /* ... Same as previous definition, using staticElectionResults and staticVotersList ... */
    const chartOptions = { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false }, title: { display: true, text: 'Election Vote Distribution', font: { size: 18, weight: 'bold' }, padding: { top: 10, bottom: 20 } }, tooltip: {} }, scales: { x: { beginAtZero: true, title: { display: true, text: 'Number of Votes', font: { size: 14, weight: '600' } } }, y: { title: { display: false }, grid: { display: false } } }, animation: { duration: 1200, easing: 'easeInOutQuart' } };
    const chartData = { labels: staticElectionResults.candidates.map(c => c.name), datasets: [{ label: 'Votes Received', data: staticElectionResults.candidates.map(c => c.votes), backgroundColor: staticElectionResults.candidates.map(c => c.color), borderColor: staticElectionResults.candidates.map(c => c.color.replace('0.7', '1')), borderWidth: 1, borderRadius: 5, barThickness: 30 }], };
     return ( <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem', background: '#fff' }}> <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}> <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, textAlign: 'left', color: '#2c3e50' }}> <Assessment sx={{ mr: 1, verticalAlign: 'middle' }}/> Election Results </Typography> <Button variant="outlined" color="secondary" onClick={onLogout} size="small"> Admin Logout </Button> </Box> <Divider sx={{ mb: 4 }} /> <Grid container spacing={4}> <Grid item xs={12} md={7}> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Vote Summary</Typography> <Box sx={{ height: 400, position: 'relative', background: '#f8f9fa', p: 2, borderRadius: '8px', border: '1px solid #e0e0e0' }}> <Bar options={chartOptions} data={chartData} /> </Box> <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', textAlign: 'center' }}> Total Votes Cast: {staticElectionResults.totalVotes.toLocaleString()} </Typography> </Grid> <Grid item xs={12} md={5}> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Voters Participated ({staticVotersList.length})</Typography> <Paper variant="outlined" sx={{ height: 450, overflowY: 'auto', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}> <List dense> {staticVotersList.map((voter, index) => ( <React.Fragment key={voter.id}> <ListItem> <ListItemIcon sx={{ minWidth: 35 }}><PersonPin color="action" fontSize="small" /></ListItemIcon> <ListItemText primary={voter.name} secondary={`ID: ${voter.id} | Voted: ${voter.timestamp}`} primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }} secondaryTypographyProps={{ fontSize: '0.8rem' }} /> </ListItem> {index < staticVotersList.length - 1 && <Divider component="li" variant="inset" />} </React.Fragment> ))} </List> </Paper> <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}> *List for verification purposes only. </Typography> </Grid> </Grid> </Paper> </Container> );
};

// --- Election Info Page Component --- (Keep definition from previous response)
const ElectionInfoPage = ({ onBack }) => {
    /* ... Same as previous definition ... */
    return ( <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}> <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}> <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> <Info sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} /> <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}> Election Information </Typography> </Box> <Divider sx={{ mb: 3 }} /> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}> Election Title: Annual Student Body Election 2024 </Typography> <Typography paragraph color="text.secondary"> Welcome to the official portal...</Typography> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}> Voting Period </Typography> <Typography paragraph color="text.secondary"> Starts: Oct 26, 2024, 09:00 AM IST <br /> Ends: Oct 28, 2024, 05:00 PM IST </Typography> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}> Eligibility </Typography> <Typography paragraph color="text.secondary"> All currently enrolled full-time students...</Typography> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}> How to Vote </Typography> <Typography component="div" color="text.secondary" paragraph> <ol style={{ paddingLeft: '20px', marginTop: '8px' }}><li>Authenticate</li><li>Fill details</li><li>Verify identity</li><li>Select candidate</li><li>Submit vote.</li></ol> </Typography> <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 3 }}> Need Help? </Typography> <Typography paragraph color="text.secondary"> Use the "Help" button or contact <a href="mailto:election@example.com">election@example.com</a>.</Typography> <Box sx={{ mt: 4, textAlign: 'center' }}> <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}> Back to Home </Button> </Box> </Paper> </Container> );
};

// --- Candidate Profiles Page Component --- (Keep definition from previous response)
const CandidateProfilesPage = ({ onBack }) => {
    /* ... Same as previous definition, using staticCandidates ... */
     return ( <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}> <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}> <PeopleAlt sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} /> <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}> Candidate Profiles </Typography> </Box> <Divider sx={{ mb: 3 }} /> <Grid container spacing={4}> {staticCandidates.map((candidate) => ( <Grid item xs={12} sm={6} md={4} key={candidate.id}> <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '1rem', boxShadow: 3, transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}> <CardMedia component="img" sx={{ height: 160, objectFit: 'contain', p: 2, background: '#f0f4f8' }} image={candidate.image} alt={`${candidate.name} Logo`} /> <CardContent sx={{ flexGrow: 1 }}> <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600 }}> {candidate.name} </Typography> <Typography variant="body2" color="text.secondary"> {candidate.bio} </Typography> </CardContent> </Card> </Grid> ))} </Grid> <Box sx={{ mt: 4, textAlign: 'center' }}> <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}> Back to Home </Button> </Box> </Paper> </Container> );
};


// ========================================================================
// --- NEW Component Definitions ---
// ========================================================================

// --- Admin Config Page ---
const AdminConfigPage = ({ config, onSave, loading, onBack }) => {
    const [currentConfig, setCurrentConfig] = useState(config);

    useEffect(() => {
        setCurrentConfig(config); // Sync if prop changes
    }, [config]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCurrentConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveClick = () => {
        onSave(currentConfig); // Pass updated config back to App
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Settings sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}>
                        Election Configuration
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth name="title" label="Election Title" variant="outlined"
                            value={currentConfig.title} onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth name="startDate" label="Start Date" type="date" variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={currentConfig.startDate} onChange={handleChange}
                         />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth name="endDate" label="End Date" type="date" variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            value={currentConfig.endDate} onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={<Switch checked={currentConfig.allowNewRegistrations} onChange={handleChange} name="allowNewRegistrations" />}
                            label="Allow New User Registrations During Voting"
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={<Switch checked={currentConfig.verificationRequired} onChange={handleChange} name="verificationRequired" />}
                            label="Require Webcam Identity Verification"
                        />
                    </Grid>
                     {/* Add more config options here as needed */}
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                     <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
                        Back to Admin Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveClick}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <CheckCircle />}
                    >
                        {loading ? 'Saving...' : 'Save Configuration'}
                    </Button>
                </Box>
                <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'warning.main' }}>
                    Note: Saving is simulated in this demo. Changes are not persistent.
                </Typography>
            </Paper>
        </Container>
    );
};

// --- Admin User Management Page ---
const AdminUserManagementPage = ({ users, onUpdateUserStatus, loading, onBack }) => {
    // In a real app, fetch users and handle updates via API

    const handleStatusToggle = (userId, currentStatus) => {
        // Find user and toggle status (simulate)
        const newStatus = !currentStatus; // Simple toggle for demo
        onUpdateUserStatus(userId, newStatus);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Group sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}>
                        User Management
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Add search/filter controls here in a real app */}

                <TableContainer>
                    <Table stickyHeader aria-label="user management table">
                        <TableHead>
                            <TableRow>
                                <TableCell>University ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Can Vote</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} hover>
                                    <TableCell component="th" scope="row">{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={user.status}
                                            color={user.status === 'Active' ? 'success' : 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                     <TableCell align="center">
                                        {user.canVote ? <CheckCircle color="success" fontSize="small"/> : <CloseIcon color="error" fontSize="small"/>}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color={user.canVote ? "warning" : "success"}
                                            onClick={() => handleStatusToggle(user.id, user.canVote)}
                                            disabled={loading} // Disable while any action is loading
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {user.canVote ? 'Disable Voting' : 'Enable Voting'}
                                        </Button>
                                        {/* Add more actions like 'View Details', 'Reset Password' etc. */}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                 <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'warning.main' }}>
                    Note: User status changes are simulated and not persistent.
                </Typography>
                 <Box sx={{ mt: 4, textAlign: 'left' }}>
                     <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
                        Back to Admin Dashboard
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

// --- Voter Profile Page ---
const VoterProfilePage = ({ profileData, onUpdateProfile, loading, onBack }) => {
    const [editableProfile, setEditableProfile] = useState(profileData);
    const [editMode, setEditMode] = useState(false); // Toggle edit state

    useEffect(() => {
        setEditableProfile(profileData); // Sync if prop data changes
    }, [profileData]);

    const handleChange = (event) => {
        setEditableProfile(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSave = () => {
        onUpdateProfile(editableProfile); // Send updated data back
        setEditMode(false); // Exit edit mode after simulated save
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', mb: 2 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <Person sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
                        <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}>
                            Your Profile
                        </Typography>
                    </Box>
                    <Button size="small" onClick={() => setEditMode(!editMode)}>
                        {editMode ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {/* Display fields, make some editable in editMode */}
                    <Grid item xs={12}>
                        <TextField fullWidth label="Full Name" name="fullName" value={editableProfile.fullName} onChange={handleChange} variant={editMode ? "outlined" : "filled"} InputProps={{ readOnly: !editMode }} />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Date of Birth" name="dob" value={editableProfile.dob} variant="filled" InputProps={{ readOnly: true }} helperText="Cannot be changed" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Voter ID" name="voterID" value={editableProfile.voterID} variant="filled" InputProps={{ readOnly: true }} helperText="Cannot be changed" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Email Address" name="email" type="email" value={editableProfile.email} onChange={handleChange} variant={editMode ? "outlined" : "filled"} InputProps={{ readOnly: !editMode }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Phone Number" name="phoneNumber" value={editableProfile.phoneNumber} onChange={handleChange} variant={editMode ? "outlined" : "filled"} InputProps={{ readOnly: !editMode }} />
                    </Grid>
                     <Grid item xs={12}>
                        <TextField fullWidth label="Address" name="address" value={editableProfile.address} onChange={handleChange} variant={editMode ? "outlined" : "filled"} InputProps={{ readOnly: !editMode }} multiline rows={2}/>
                    </Grid>
                    {/* Add other fields as needed */}
                </Grid>

                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                     <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
                        Back to Home
                    </Button>
                     {editMode && (
                        <Button variant="contained" color="primary" onClick={handleSave} disabled={loading} startIcon={loading ? <CircularProgress size={20}/> : <CheckCircle />}>
                             {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                 </Box>
                 {editMode && <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'warning.main' }}> Note: Saving is simulated. Changes are not persistent. </Typography>}
            </Paper>
        </Container>
    );
};

// --- FAQ Page Component ---
const FAQPage = ({ onBack }) => {
    return (
         <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HelpOutline sx={{ mr: 1, fontSize: '2rem', color: 'primary.main' }} />
                    <Typography variant="h4" component="h1" className="voting-title" sx={{ mb: 0, color: '#2c3e50' }}>
                        Frequently Asked Questions (FAQ)
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {staticFaqData.map((item, index) => (
                     <Accordion key={index} sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0,0,0,0.1)', '&:before': { display: 'none'}, '&:last-child': { borderBottom: 0} }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontWeight: 600 }}>{item.q}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography color="text.secondary">{item.a}</Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}

                 <Box sx={{ mt: 4, textAlign: 'center' }}>
                     <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
                        Back to Home
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};


// ========================================================================
// --- Main App Component ---
// ========================================================================
function App() {
    // --- State Variables ---
    const [currentView, setCurrentView] = useState('welcome');
    // User Flow
    const [authMode, setAuthMode] = useState('login');
    const [user, setUser] = useState({ username: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userDetails, setUserDetails] = useState({ // Holds logged-in user's details
        fullName: '', dob: '', address: '', idNumber: '', phoneNumber: '',
        email: '', gender: '', nationality: '', occupation: '',
        education: '', UniversityID: '', postalCode: ''
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [webcamActive, setWebcamActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState('');
    const [scanning, setScanning] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    // Admin Flow
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [electionConfig, setElectionConfig] = useState(staticInitialElectionConfig); // Use static config
    const [managedUsers, setManagedUsers] = useState(staticManagedUsers); // Use static users
    // General UI
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [helpDialog, setHelpDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    // Refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    

    // Constants
    const steps = ['Authentication', 'Personal Details', 'Identity Verification', 'Vote']; // For Stepper

    // --- Helper Functions ---
    const showSnackbar = (message, severity = 'info') => setSnackbar({ open: true, message, severity });

    // --- Webcam Functions --- (Keep definitions from above)
    const stopWebcam = useCallback(() => { /* ... */ if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; } if (videoRef.current) videoRef.current.srcObject = null; setWebcamActive(false); setVerificationSuccess(false); setScanning(false); console.log("Webcam stopped"); }, []);
    const startWebcam = async () => { /* ... */ if (webcamActive) return; setScanning(true); setVerificationSuccess(false); setCapturedImage(''); try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) { videoRef.current.srcObject = stream; streamRef.current = stream; setWebcamActive(true); console.log("Webcam started"); setTimeout(() => { if (streamRef.current) { setScanning(false); setVerificationSuccess(true); showSnackbar("Face scan simulation complete!", "success"); } }, 3000); } else { throw new Error("Video element not ready"); } } catch (err) { console.error("Error accessing webcam: ", err); showSnackbar(`Unable to access webcam: ${err.message}. Check permissions.`, "error"); setScanning(false); setWebcamActive(false); } };
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setCapturedImage(canvas.toDataURL('image/jpeg'));
        }
      };
    // --- Event Handlers ---
    const handleAuthSubmit = async (e, type) => {
        e.preventDefault();
        if (type === 'signup' && user.password !== confirmPassword) { showSnackbar("Passwords do not match!", "error"); return; }
        setLoading(true); await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
        // --- Simulate fetching/setting user details on login/signup ---
        setUserDetails({
            fullName: type === 'signup' ? 'New User' : 'Demo User', // Example names
            dob: '1995-01-01', address: '123 Voting St, Anytown', idNumber: 'DEMO12345',
            phoneNumber: '555-1234', email: `${user.username}@example.com`, gender: 'other',
            universityID: `UniversityID${Math.random().toString().substring(2, 8)}`, postalCode: '12345'
        });
        // --- End Simulation ---
        setIsLoggedIn(true); setCurrentView('details');
        showSnackbar(type === 'login' ? "Login successful!" : "Account created!", "success");
        setLoading(false);
    };
    const handleDetailsSubmit = async (e) => { e.preventDefault(); setLoading(true); await new Promise(resolve => setTimeout(resolve, 500)); setCurrentView('verification'); showSnackbar("Details saved!", "success"); setLoading(false); };
    const handleVerificationComplete = () => { if (!capturedImage || !verificationSuccess) { showSnackbar("Capture image & ensure verification succeeded.", "warning"); return; } setLoading(true); setTimeout(() => { setCurrentView('vote'); showSnackbar("Identity verified!", "success"); setLoading(false); stopWebcam(); }, 500); };
    const handleVoteSubmit = async (e) => { e.preventDefault(); if (!selectedCandidate) { showSnackbar("Please select a candidate!", "warning"); return; } setLoading(true); await new Promise(resolve => setTimeout(resolve, 1000)); setCurrentView('confirmation'); showSnackbar("Vote submitted!", "success"); setShowConfetti(true); setLoading(false); };
    const handleAdminLogin = async (email, password) => { setLoading(true); await new Promise(resolve => setTimeout(resolve, 500)); if (email === 'admin@example.com' && password === 'admin') { setIsAdminLoggedIn(true); setCurrentView('admin-dashboard'); showSnackbar('Admin login successful!', 'success'); } else { showSnackbar('Invalid admin credentials.', 'error'); setIsAdminLoggedIn(false); } setLoading(false); };
    const handleAdminLogout = () => { setIsAdminLoggedIn(false); setCurrentView('welcome'); showSnackbar('Admin logged out.', 'info'); };
    const handleNavigate = (view) => { if (currentView === 'verification' && view !== 'verification') stopWebcam(); setCurrentView(view); };

    // --- NEW Handlers for Added Pages (Simulated) ---
    const handleSaveConfig = async (newConfig) => {
        setLoading(true);
        showSnackbar("Saving configuration...", "info");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setElectionConfig(newConfig); // Update local state
        setLoading(false);
        showSnackbar("Configuration saved successfully (Simulated)!", "success");
    };

    const handleUpdateUserStatus = async (userId, newCanVoteStatus) => {
        setLoading(true);
        showSnackbar(`Updating status for user ${userId}...`, "info");
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call
        setManagedUsers(prevUsers =>
            prevUsers.map(u =>
                u.id === userId ? { ...u, canVote: newCanVoteStatus, status: newCanVoteStatus ? 'Active' : 'Inactive' } : u
            )
        );
        setLoading(false);
        showSnackbar(`User ${userId} voting status updated (Simulated)!`, "success");
    };

     const handleUpdateProfile = async (updatedProfileData) => {
        setLoading(true);
        showSnackbar("Saving profile...", "info");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setUserDetails(updatedProfileData); // Update logged-in user's details state
        setLoading(false);
        showSnackbar("Profile updated successfully (Simulated)!", "success");
    };

    // --- Effects ---
    useEffect(() => { if (currentView === 'verification' && !webcamActive) startWebcam(); }, [currentView, webcamActive, startWebcam]);
    useEffect(() => { return () => stopWebcam(); }, [stopWebcam]);

    // --- UI Handlers ---
    const handleCloseSnackbar = (event, reason) => { if (reason === 'clickaway') return; setSnackbar({ ...snackbar, open: false }); };
    const closeConfetti = () => setShowConfetti(false);
    const resetToHome = () => {
        stopWebcam(); setCurrentView('welcome'); setIsLoggedIn(false); setIsAdminLoggedIn(false);
        setUser({ username: '', password: '' }); setConfirmPassword('');
        setUserDetails({ /* Reset */ fullName: '', dob: '', address: '', idNumber: '', phoneNumber: '', email: '', gender: '', nationality: '', occupation: '', education: '', UniversityID: '', postalCode: '' });
        setCapturedImage(''); setSelectedCandidate(''); setVerificationSuccess(false); setShowConfetti(false); setAuthMode('login');
        // Reset admin-related static data if needed (though usually fetched fresh)
        // setElectionConfig(staticInitialElectionConfig);
        // setManagedUsers(staticManagedUsers);
    };

     // Stepper Logic
     const getActiveStep = () => { switch (currentView) { case 'auth': return 0; case 'details': return 1; case 'verification': return 2; case 'vote': return 3; default: return -1; } };
     const activeStep = getActiveStep();

    // --- Render Logic ---
    const renderContent = () => {
        switch (currentView) {
            // --- User Voting Flow ---
            case 'welcome': return (<Box className="welcome-screen" sx={{ pt: '50px' }}>


 {/* ... Welcome Content ... */} <Typography variant="h3" component="h1" className="welcome-title" gutterBottom> Welcome to the Secure Voting System </Typography> <Typography variant="h5" className="welcome-subtitle" color="text.secondary" gutterBottom align="center"> Easy and reliable online voting. </Typography> <Grid container spacing={4} justifyContent="center" sx={{ my: 4 }}> <Grid item xs={12} sm={6} md={4}><WelcomeCard icon={Security} title="Secure Authentication" description="Biometric verification ensures eligibility." /></Grid> <Grid item xs={12} sm={6} md={4}><WelcomeCard icon={Assignment} title="Simple Process" description="Follow easy steps to cast your vote." /></Grid> <Grid item xs={12} sm={6} md={4}><WelcomeCard icon={HowToVote} title="Reliable & Auditable" description="Your vote is recorded accurately." /></Grid> </Grid> <Typography variant="body1" className="welcome-description" sx={{ maxWidth: '700px', margin: 'auto', mb: 4 }}></Typography> <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 3, flexWrap: 'wrap' }}> <Button variant="contained" size="large" className="welcome-button" onClick={() => handleNavigate('auth')}>Vote Now  </Button> <Button variant="outlined" size="large" className="app-button" sx={{ background: 'rgba(255,255,255,0.2)'}} onClick={() => handleNavigate('info')}> Election Info </Button> <Button variant="outlined" size="large" className="app-button" sx={{ background: 'rgba(255,255,255,0.2)'}} onClick={() => handleNavigate('profiles')}> Candidate Profiles </Button> <Button variant="outlined" size="large" className="app-button" sx={{ background: 'rgba(255,255,255,0.2)'}} onClick={() => handleNavigate('faq')}> FAQ </Button></Box> <Button variant="text" size="small" color="primary" onClick={() => handleNavigate('admin-login')} sx={{ mt: 4, display:'block', mx: 'auto' }}> Admin Login </Button> </Box> );
            case 'auth': return ( <Box  className="auth-container" sx={{ mt: '50px' }}> {/* ... Auth Form ... */} <Paper className="auth-paper"> <Box className="auth-header"><Person className="auth-icon" /><Typography variant="h5" className="auth-title">Authentication</Typography></Box> <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}> <Button onClick={() => setAuthMode('login')} className={`auth-toggle-button ${authMode === 'login' ? 'Mui-selected' : ''}`}> Login </Button> <Button onClick={() => setAuthMode('signup')} className={`auth-toggle-button ${authMode === 'signup' ? 'Mui-selected' : ''}`}> Sign Up </Button> </Box> <form onSubmit={(e) => handleAuthSubmit(e, authMode)}> <TextField required fullWidth margin="normal" label="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} /> <TextField required fullWidth margin="normal" label="Password" type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} /> {authMode === 'signup' && <TextField required fullWidth margin="normal" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={confirmPassword !== '' && user.password !== confirmPassword} helperText={confirmPassword !== '' && user.password !== confirmPassword ? "Passwords do not match" : ""} />} <Button type="submit" fullWidth variant="contained" className="auth-submit-button" sx={{ mt: 2 }} disabled={loading || (authMode === 'signup' && user.password !== confirmPassword)}> {loading ? <CircularProgress size={24} color="inherit" /> : (authMode === 'login' ? 'Login' : 'Create Account')} </Button> </form> </Paper> </Box> );
            case 'details': return ( <Box className="personal-details-container" sx={{ mt: '50px', px: 3, py: 4, maxWidth: '600px', mx: 'auto' }}>

                {/* ... Details Form ... */} <Typography variant="h4" component="h2" className="personal-details-title" align="center" gutterBottom> Personal Details </Typography> <Paper className="personal-details-paper" elevation={3} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}> <form onSubmit={handleDetailsSubmit} className="personal-details-form"> <Grid container spacing={3}> <Grid item xs={12} sm={6}><TextField required fullWidth label="Full Name" variant="outlined" className="form-input" value={userDetails.fullName} onChange={(e) => setUserDetails({ ...userDetails, fullName: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} variant="outlined" className="form-input" value={userDetails.dob} onChange={(e) => setUserDetails({ ...userDetails, dob: e.target.value })} /></Grid> <Grid item xs={12}><TextField required fullWidth label="Address" variant="outlined" className="form-input" value={userDetails.address} onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="Aadhar ID" variant="outlined" className="form-input" value={userDetails.idNumber} onChange={(e) => setUserDetails({ ...userDetails, idNumber: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="University ID" variant="outlined" className="form-input" value={userDetails.universityID} onChange={(e) => setUserDetails({ ...userDetails, universityID: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="Phone Number" variant="outlined" className="form-input" value={userDetails.phoneNumber} onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="Email" type="email" variant="outlined" className="form-input" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} /></Grid> <Grid item xs={12} sm={6}><FormControl variant="outlined" required fullWidth className="form-input"><InputLabel>Gender</InputLabel><Select label="Gender" value={userDetails.gender} onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}><MenuItem value="male">Male</MenuItem><MenuItem value="female">Female</MenuItem><MenuItem value="other">Other</MenuItem></Select></FormControl></Grid> <Grid item xs={12} sm={6}><TextField required fullWidth label="Academic Year" variant="outlined" className="form-input" value={userDetails.academicYear} onChange={(e) => setUserDetails({ ...userDetails, academicYear: e.target.value })} /></Grid> </Grid> <Box className="personal-details-actions" sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}> <Button type="submit" variant="contained" className="form-submit-button" disabled={loading}> {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue to Verification'} </Button> </Box> </form> </Paper> </Box> );
            case 'verification': return (
                <Box className="verification-container">
                  <Typography variant="h4" component="h2" className="verification-title" align="center" gutterBottom>
                    Identity Verification
                  </Typography>
                  <Paper className="verification-paper" elevation={3} sx={{ p: 4, maxWidth: 700, margin: 'auto', textAlign: 'center' }}>
                    <Typography variant="h6" className="verification-subtitle" gutterBottom>
                      Webcam Verification
                    </Typography>
                    <Typography variant="body1" className="verification-description" color="text.secondary" sx={{ mb: 3 }}>
                      Allow camera access. Position face in frame.
                    </Typography>
                    
                    <EnhancedWebcamScanner 
                      videoRef={videoRef} 
                      scanning={scanning} 
                      verificationSuccess={verificationSuccess} 
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    
                    {/* Webcam Control Buttons */}
                    <Box className="verification-buttons" sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {!webcamActive && !scanning ? (
                        <Button 
                          variant="contained" 
                          className="verification-button" 
                          startIcon={<CameraAlt />} 
                          onClick={startWebcam} 
                          disabled={loading}
                        >
                          Start Camera
                        </Button>
                      ) : null}
                      
                      {webcamActive && !scanning && !verificationSuccess ? (
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          className="verification-button" 
                          onClick={captureImage}
                          disabled={!webcamActive || scanning}
                        >
                          Capture Image
                        </Button>
                      ) : null}
                      
                      {webcamActive ? (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          className="verification-button" 
                          onClick={stopWebcam} 
                          disabled={scanning}
                        >
                          Stop Camera
                        </Button>
                      ) : null}
                    </Box>
                    
                    {/* Captured Image Preview */}
                    {capturedImage && (
                      <Box className="captured-image-container" sx={{ 
                        mt: 4, 
                        border: '1px solid', 
                        borderColor: 'divider', 
                        p: 2, 
                        borderRadius: 1, 
                        maxWidth: 250, 
                        mx: 'auto' 
                      }}>
                        <Typography variant="h6" className="captured-image-title" gutterBottom>
                          Captured Image
                        </Typography>
                        <img 
                          src={capturedImage} 
                          alt="Captured face" 
                          style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                        />
                      </Box>
                    )}
                    
                    {/* Action Buttons (Capture & Confirm) */}
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      {/* New Standalone Capture Button */}
                      {webcamActive && !verificationSuccess && (
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          onClick={captureImage}
                         
                          startIcon={<CameraAlt />}
                        >
                          Capture Image
                        </Button>
                      )}
                      
                      {/* Confirm Identity Button */}
                      <Button 
                        variant="contained" 
                        className="verification-confirm-button" 
                        onClick={handleVerificationComplete}
                        disabled={!capturedImage || loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                      >
                        Confirm Identity & Proceed
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              );case 'vote': return ( <Box className="voting-container"> {/* ... Voting Content ... */} <Typography variant="h4" component="h2" className="voting-title" align="center" gutterBottom> Cast Your Vote </Typography> <Paper className="voting-paper" elevation={3} sx={{ p: 4, maxWidth: 1000, margin: 'auto' }}> <Typography variant="h6" align="center" gutterBottom color="text.secondary">Select one candidate</Typography> <form onSubmit={handleVoteSubmit} className="voting-form"> <Grid container spacing={3} justifyContent="center" sx={{ my: 3 }} className="candidate-cards-container"> {staticCandidates.map((candidate) => ( <Grid item key={candidate.id} xs={12} sm={6} md={4}> <EnhancedCandidateCard candidate={candidate.name} selected={selectedCandidate === candidate.name} onSelect={() => setSelectedCandidate(candidate.name)} image={candidate.image} /> </Grid> ))} </Grid> {capturedImage && ( <Box className="voter-info-box" sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, maxWidth: 350, mx: 'auto', background: '#f8f9fa' }}> <img src={capturedImage} alt="Voter" className="voter-image" style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} /> <Box><Typography variant="caption" color="text.secondary" display="block"> Voting as: </Typography><Typography variant="body1" className="voter-name" fontWeight="medium"> {userDetails.fullName || user.username} </Typography></Box> </Box> )} <Box className="voting-actions" sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}> <Button variant="outlined" className="voting-back-button" onClick={() => handleNavigate('verification')}> Back </Button> <Button type="submit" variant="contained" className="voting-submit-button" disabled={!selectedCandidate || loading}> {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Vote'} </Button> </Box> </form> </Paper> </Box> );
            case 'confirmation': return <VoteConfirmation userDetails={userDetails} setCurrentStep={handleNavigate} />;
            case 'profile': return isLoggedIn ? <VoterProfilePage profileData={userDetails} onUpdateProfile={handleUpdateProfile} loading={loading} onBack={() => handleNavigate('welcome')} /> : <>{handleNavigate('auth')}</>; // Redirect to auth if not logged in

            // --- Static Info Pages ---
            case 'info': return <ElectionInfoPage onBack={() => handleNavigate('welcome')} />;
            case 'profiles': return <CandidateProfilesPage onBack={() => handleNavigate('welcome')} />;
            case 'faq': return <FAQPage onBack={() => handleNavigate('welcome')} />;

            // --- Admin Flow ---
            case 'admin-login': return <AdminLoginPage onLogin={handleAdminLogin} loading={loading} />;
            case 'admin-dashboard': // NEW Admin landing/menu page
                 if (!isAdminLoggedIn) return <AdminLoginPage onLogin={handleAdminLogin} loading={loading} />; // Protect
                 return (
                    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: '1rem' }}>
                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h4" component="h1" sx={{ color: '#2c3e50', fontWeight: 700 }}>Admin Dashboard</Typography>
                                <Button variant="outlined" color="secondary" onClick={handleAdminLogout} size="small">Logout</Button>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} sm={6} md={4}> <Button fullWidth variant="contained" startIcon={<Assessment />} onClick={() => handleNavigate('admin-results')} sx={{ py: 2 }}>View Results</Button> </Grid>
                                <Grid item xs={12} sm={6} md={4}> <Button fullWidth variant="contained" startIcon={<Settings />} onClick={() => handleNavigate('admin-config')} sx={{ py: 2 }}>Election Config</Button> </Grid>
                                <Grid item xs={12} sm={6} md={4}> <Button fullWidth variant="contained" startIcon={<Group />} onClick={() => handleNavigate('admin-users')} sx={{ py: 2 }}>User Management</Button> </Grid>
                                {/* Add more admin links here */}
                            </Grid>
                        </Paper>
                    </Container>
                 );
            case 'admin-results': return isAdminLoggedIn ? <AdminResultsPage onLogout={handleAdminLogout} /> : <AdminLoginPage onLogin={handleAdminLogin} loading={loading} />;
            case 'admin-config': return isAdminLoggedIn ? <AdminConfigPage config={electionConfig} onSave={handleSaveConfig} loading={loading} onBack={() => handleNavigate('admin-dashboard')} /> : <AdminLoginPage onLogin={handleAdminLogin} loading={loading} />;
            case 'admin-users': return isAdminLoggedIn ? <AdminUserManagementPage users={managedUsers} onUpdateUserStatus={handleUpdateUserStatus} loading={loading} onBack={() => handleNavigate('admin-dashboard')} /> : <AdminLoginPage onLogin={handleAdminLogin} loading={loading} />;

            default: return <Typography sx={{ textAlign: 'center', mt: 5 }}>Page not found or invalid state.</Typography>;
        }
    };

    return (
        <div className="app-container">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} onConfettiComplete={closeConfetti} numberOfPieces={400} gravity={0.2} />}

            {/* Header */}
            <AppBar position="static" className="app-bar">
               <Toolbar sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigate(isAdminLoggedIn ? '/admin' : '/')}>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigate(isAdminLoggedIn ? 'admin-dashboard' : 'welcome')}>
                        <HowToVote className="app-icon" />
                        <Typography variant="h6" component="div" className="app-title"> Secure Voting System </Typography>
                    </Box>
                    <Box className="app-buttons">
                         {/* Common Buttons */}
                        {!isAdminLoggedIn && currentView !== 'admin-login' && ( <Button color="inherit" className="app-button" onClick={() => setHelpDialog(true)} startIcon={<Info />}> Help </Button> )}
                        {/* User Buttons */}
                        {isLoggedIn && !isAdminLoggedIn && currentView !== 'welcome' && ( <Button color="inherit" className="app-button" onClick={() => handleNavigate('profile')} startIcon={<Person />}> Profile </Button> )}
                        {/* Home Button (conditional) */}
                        {(currentView !== 'welcome' && currentView !== 'admin-dashboard') && ( <Button color="inherit" className="app-button" onClick={resetToHome} startIcon={<Home />}> Home </Button> )}
                         {/* Admin Buttons */}
                         {isAdminLoggedIn && currentView !== 'admin-dashboard' && ( <Button color="inherit" className="app-button" onClick={() => handleNavigate('admin-dashboard')} startIcon={<AdminPanelSettings />}> Admin Dashboard </Button> )}
                         {isAdminLoggedIn && ( <Button color="inherit" className="app-button" onClick={handleAdminLogout} startIcon={<Lock />}> Admin Logout </Button> )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Progress Stepper */}
            {activeStep !== -1 && currentView !== 'confirmation' && (
                <Box className="stepper-container" sx={{ my: 3 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, index) => ( <Step key={label} completed={activeStep > index}> <StepLabel>{label}</StepLabel> </Step> ))}
                    </Stepper>
                </Box>
            )}

            {/* Main Content Area */}
            <Container className="main-container" sx={{ mt: activeStep !== -1 ? 0 : 3 }}>
                 {renderContent()}
            </Container>

            {/* Dialogs and Snackbars */}
            <Dialog open={helpDialog} onClose={() => setHelpDialog(false)} maxWidth="sm" fullWidth>
                 <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> <span><Info sx={{ mr: 1, verticalAlign:'bottom' }} /> Help & Information</span> <IconButton aria-label="close" onClick={() => setHelpDialog(false)} sx={{ color: (theme) => theme.palette.grey[500] }}> <CloseIcon /> </IconButton> </DialogTitle>
                <DialogContent dividers> <Typography variant="h6" gutterBottom> How to Use </Typography> <Typography component="div" variant="body2" sx={{ mb: 3 }}> <ol style={{ paddingLeft: '20px', marginTop: '8px' }}><li>Authenticate...</li><li>Fill details...</li><li>Verify identity...</li><li>Select candidate...</li><li>Submit vote.</li></ol> </Typography> <Typography variant="h6" gutterBottom> Webcam Verification </Typography> <Typography variant="body2" sx={{ mb: 3 }}> Allow camera access, good lighting needed... </Typography> <Typography variant="h6" gutterBottom> Security & Privacy </Typography> <Typography variant="body2"> Your vote is confidential and secure...</Typography> </DialogContent>
                <DialogActions> <Button onClick={() => setHelpDialog(false)} color="primary"> Close </Button> </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}> {snackbar.message} </Alert>
            </Snackbar>

            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" /> <Typography sx={{ ml: 2 }}>Processing...</Typography>
            </Backdrop>


        </div>
    );
}
import { Chip } from '@mui/material';

export default App;