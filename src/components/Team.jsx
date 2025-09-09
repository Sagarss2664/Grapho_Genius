import React from 'react';
import Sagar from '../../src/components/Images/Sagar.jpg';
import Sunitha from '../../src/components/Images/Sunitha.png';
import Koushik from '../../src/components/Images/Koushik.jpg';
import Vishwanath from '../../src/components/Images/Vishwanath.jpg';
import Pavan from '../../src/components/Images/Pavu.jpg';
import hitin from '../../src/components/Images/hitin.jpg';
import manju from '../../src/components/Images/manju.jpg';
import girish from '../../src/components/Images/Girish.png';
import './team.css'
import logo from './GG-removebg-preview.png'; // Import your logo here
import { Link } from 'react-router-dom';
const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Dr. P G Sunitha Hiremath",
      role: "Professor",
      university: "KLE Technological University Hubli",
      email: "sunithahiremath64@gmail.com",
      bio: "Dr. P G Sunitha Hiremath madam guides us in the overall project and helps in designing the app interface.",
      image: Sunitha
    },
    {
      id: 2,
      name: "Sagar Shegunashi",
      role: "Student",
      university: "KLE Technological University Hubli",
      email: "sagarshegunasi2664@gmail.com",
      bio: "Sagar oversees technical development, specializing in scalable cloud architectures. He manages backend deployment on Render and frontend deployment on GitHub. Additionally, he writes backend APIs and maintains the MongoDB database, ensuring efficient data management and system performance.",
      image: Sagar
    },
    {
      id: 3,
      name: "Koushik K Reddy",
      role: "Student",
      university: "KLE Technological University Hubli",
      email: "koushikkro580@gmail.com",
      bio: "Koushik develops the frontend, ensuring a smooth user experience while integrating responsive design. He also modifies backend APIs based on frontend needs, optimizing data flow, troubleshooting issues, and enhancing performance for seamless interaction between the client and server.",
      image: Koushik
    },
    {
      id: 4,
      name: "Vishwanath Hubballi",
      role: "Student",
      university: "KLE Technological University Hubli",
      email: "workvishwawork@gmail.com",
      bio: "Vishwanath is responsible for designing the interface and developing the frontend. He writes CSS code to create an interactive and visually appealing user experience, ensuring smooth responsiveness and an engaging design.",
      image: Vishwanath
    },
     {
      id: 5,
      name: "Pavan",
      role: "Student",
      university: "KLE Technological University Hubli",
      email: "pavan@gmail.com",
      bio: "pavan develops the frontend, ensuring a smooth user experience while integrating responsive design. He also modifies backend APIs based on frontend needs, optimizing data flow, troubleshooting issues, and enhancing performance for seamless interaction between the client and server.",
      image: Pavan
    },
   {
      id: 6,
      name: "Hithin kumar c",
      role: "Student",
      university: "KLE Technological University Hubli",
      email: "hithinchitriki@gmail.com",
      bio: "Hithin is responsible for developing and enhancing the frontend, ensuring a user-friendly and visually appealing interface. He writes CSS code to build responsive layouts and interactive features",
      image: hitin
    },
 {       
  id: 7,       
  name: "Manjunath Nadagouda",       
  role: "Graphologist",       
  university: "Senior Tech Lead at BOSCH",       
  email: "manjunathcs10@gmail.com",       
  bio: "Manjunath Nadagouda is a graphologist who brings deep expertise in handwriting analysis and its practical applications. He is the driving force behind the development of our Deep Learning model, guiding the entire process from concept to implementation. He ensures that the theoretical aspects are accurately translated into the model’s architecture, making the tool scientifically sound and reliable. With his continuous guidance, we were able to design and fine-tune the system effectively. Apart from being a mentor and subject matter expert, he is also one of the active users of the GraphoGenius tool, validating its features and ensuring that it meets real-world graphology needs.",       
  image: manju     
 },
    {
  id: 8,
  name: "Dr. Girishbabu N",
  role: "Psychiatrist",
  university: "Manoshanti, Hubli",
  email: "girish@manoshanti.com",
  bio: "DR. Girishbabu  is a psychiatrist at Manoshanti, Hubli, He contributed his expertise in psychology by preparing the detailed questionnaires that form the foundation of the GraphoGenius tool. His insights helped us connect graphology with psychological evaluation, ensuring the tool is practical and scientifically aligned. He is also an active user of GraphoGenius.",
  image: girish
}
  ];

  return (
    <div className="team">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            {/* Uncomment and replace with your PNG logo */}
            <img src={logo} alt="GraphoGenius Logo" className="logo-image" />
        
            
            <span className="logo-text">GraphoGenius</span>
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/team" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/admin-login" className="nav-link">Admin</Link>
            <div className="auth-buttons">
              <Link to="/user-login" className="btn btn-login">Login</Link>
              <Link to="/register" className="btn btn-register">Register</Link>
            </div>
          </div>
          <button className="mobile-menu-btn">☰</button>
        </div>
      </nav>
      <section className="team-hero">
        <div className="container">
          <h1>Meet Our Team</h1>
          
          <p>The brilliant minds behind Grapho Genius</p>
        </div>
      </section>

      <section className="team-members">
        <div className="container">
          <div className="members-grid">
            {teamMembers.map(member => (
              <div key={member.id} className="member-card">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <p className="university">{member.university}</p>
                <p className="email">{member.email}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="join-team">
        <div className="container">
          <h2>Want to Join Our Team?</h2>
          <p>We're always looking for talented individuals passionate about transforming real estate technology.</p>
          <button className="btn primary">View Open Positions</button>
        </div>
      </section>
    </div>
  );
};

export default Team;
