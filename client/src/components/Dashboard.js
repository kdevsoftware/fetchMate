import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBCollapse, MDBContainer, MDBIcon, MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBNavItem, MDBRow } from 'mdbreact';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link } from 'react-router-dom';
import { login } from '../redux/actions';
import '../styles/dashboard.css'
import ProjectCard from './card/DashboardProjectCard';
import ContributeProjectCard from "./card/DashboardConProjectCard";
import logo from '../images/logo3.png';
import Footer from './Footer';

export default function Dashboard() {

  const [currentUserData, setCurrentUserData] = useState([])
  const user = useSelector(state => state.user);
  const dispatch = useDispatch()

  
  useEffect(()=>{
    fetch('/api/v1/hub/current')
    .then(res=>res.json())
    .then(data=>{
      setCurrentUserData(data)
      dispatch(login(data))
    })
  }, [dispatch, setCurrentUserData])
  
    return (
    <>
      <BrowserRouter>
  <MDBNavbar  dark expand="md">
        <MDBNavbarBrand>
        <img src={logo} alt="logo" width="60%"/>
        </MDBNavbarBrand>
        <MDBNavbarToggler />
        <MDBCollapse id="navbarCollapse3"  navbar className="d-flex justify-content-around">
          <MDBNavbarNav left>
            <MDBNavItem active>
              <Link to="#!">Home</Link>
            </MDBNavItem>
            <MDBNavItem>
              <Link to="/hub">Profile Setup</Link>
            </MDBNavItem>
            <MDBNavItem>
              <Link to="/projectForm">Project Form</Link>
            </MDBNavItem>
            <MDBNavItem>
              <Link to="/dashboard">Dashboard</Link>
            </MDBNavItem>
            <MDBNavItem>
              <Link to="#!" >Logout</Link>
            </MDBNavItem>
            </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
  </BrowserRouter>

      <div id="top">
    <MDBContainer>
      <MDBRow>
      <MDBCol md='3' className="mt-5">
      <MDBCard testimonial className="card-profile" >
      <div gradient='aqua' backgroundColor="red"/>
          <div className='mx-auto white'>
          <img
              src={user.loginInfo.profilePicture} 
              alt='' className="img-fluid rounded-circle hoverable border border-info" width="100%" 
            />
          </div>
          <MDBCardBody>
          <h4 className='card-title'> <MDBIcon icon="user indigo-text" /> {user.loginInfo.firstName} {user.loginInfo.lastName} </h4>
          <h4 className='card-title'><MDBIcon far icon="newspaper" /> Headline</h4>
          <h4 className='card-title'> <MDBIcon icon="envelope orange-text" /> {user.loginInfo.email} </h4> 
          <button name="button" type="button" class="btn btn-block  edit-button" >Edit profile</button>
            <hr />

            <h3 class="card-title">
            <MDBIcon icon="cogs grey-text" /> Technical Skills
              {console.log(currentUserData)}
              {Object.keys(currentUserData).length > 0 && currentUserData.Skills.filter((userData)=>{
                return (userData.category === "technical")
                
              }).map((name)=>{
                return name.name + " " 
              })}
            </h3>
            <br/>
            <hr />

            <h3 class="card-title">
            <MDBIcon icon="hand-holding-heart pink-text" /> Soft Skills
            </h3>
            <br/>
            <hr />

            <h3 class="card-title">
            <MDBIcon icon="language purple-text" /> Spoken languages
              
              {Object.keys(currentUserData).length > 0 && currentUserData.Skills.filter((userData)=>{
                return (userData.category === "language")
                
              }).map((name)=>{
                return name.name + " "
              })}
            </h3>
            <br/>
            <hr />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>

    
      <MDBCol className="projects-col">
          <h1 className="title-cards">My Projects</h1>
          {Object.keys(currentUserData).length > 0 && currentUserData.Projects.map((project, index)=>{
            return <ProjectCard key={project.id} project={project}/>
          })} 
          <button className="btn btn-block mb-3 publish-button">
            Publish a new project
          </button>
          <br />

          <h1 className="title-cards">Contribuiting Projects</h1>
    {Object.keys(currentUserData).length > 0 && currentUserData.MemberProjects.map((project, index)=>{
            return <ContributeProjectCard key={project.id} project={project}/>
          })}
      
  <h1 className="title-cards">Pending Projects</h1>
      <MDBCard className="card-body card-body-pending1 " >
        <aside>
     
          
        </aside>

      <MDBCard className="card-body card-body-pending2">
        <aside>
    <MDBCardTitle className="project-title"> <MDBIcon icon="link" /> Project title</MDBCardTitle>
    <MDBCardText>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
    </MDBCardText>
    <div className="flex-row ">
    <Link to="/public" className="card-link">
      
    <MDBIcon icon="user" /> owners name
      </Link>
      <a href="#!" className="card-link"> 
      </a>  
    </div>
    </aside>
    </MDBCard>
  </MDBCard>
  </MDBCol>
    </MDBRow>
    </MDBContainer>
        </div>

        <Footer />
      </>
    )
}
