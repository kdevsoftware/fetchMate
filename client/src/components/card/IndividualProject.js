import { MDBCard, MDBCardText, MDBCardTitle, MDBCol, MDBIcon, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow } from 'mdbreact'
import React, {  useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


export default function IndividualProject(props) {
    const {project} = props
    const user = useSelector(state => state.user)
    // !! makes it a boolean
    const isApplied = !!(project.Members.find(member => {
        return member.id === user.loginInfo.id
    }))
    const isAccepted = !!(user.loginInfo.MemberProjects.find(memProject => {
        return memProject.TeamMember.ProjectId === project.id && memProject.TeamMember.approved === "approved"
    }))
    const isOwner = project.User.id === user.loginInfo.id
    
    const [accepted, setAccepted] = useState(isAccepted)
    const [applied, setApplied] = useState(isApplied)
    const [comment, setComment] = useState([])
    const [modal, setModal] = useState(false);
    // console.log(project)
    const cancelApply = () =>{
        fetch(`/api/v1/projects/${project.id}/teamMember`, {
            method: 'DELETE',
            body: JSON.stringify({
                memberIdArray: user.loginInfo.id
            }),
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setApplied(false)
                props.loadProject() 
            })    
    }
    const applyProject = (e) => {
        console.log(user)
        fetch(`/api/v1/projects/${project.id}/teamMember`, {
            method: 'POST',
            body: JSON.stringify({
                memberIdArray: user.loginInfo.id
            }),
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setApplied(true)
                props.loadProject() 
            })
    }
    useEffect(()=>{
        fetch(`/api/v1/projects/${project.id}/comments`)
    .then(res=>res.json())
    .then(data=>{
        setComment(data)
    })
    },[project.id])
    
    // useEffect(()=>{
    //     cancelApply()
    //     applyProject()
    // },[cancelApply, applyProject])

    // Modal
    const toggle = () => {
        setModal(!modal);
    }

    return (
        <div>
            <div key={project.id}>

                <MDBRow>
                    <MDBCol className="individual-col">
                    
                        <MDBCard className="card-body card-body-all-projects1 mb-5" >
                        <aside>
    
                            </aside>
                            <MDBCard className="card-body card-body-all-projects2">
                            <aside>
                            <MDBCardTitle className="project-title"><Link className="project-tilte" to={isOwner ? `/dashboard/${project.id}` : `/projects`}><MDBIcon icon="link" /> {project.title} </Link></MDBCardTitle>
                            <MDBCardText>
                                {project.description.slice(0, 90)}{(project.description.length > 90 && "...")} <Link to="#" onClick={toggle}>Read More</Link> 
                                <MDBModal isOpen={modal} toggle={toggle}>
                                <MDBModalHeader toggle={toggle}>Privacy Measures</MDBModalHeader>
                                <MDBModalBody>
                            We respect our users privacy. The full description will only be available after the project owner accepts your application. We appreciate your understanding.
                            </MDBModalBody>
                            <MDBModalFooter>
                                <button className='btn btn-primary' onClick={toggle}>Close</button>
                            </MDBModalFooter>
                        </MDBModal>



                            </MDBCardText>
                            <MDBCardText>
                                <h1 className="all-prjects-skills-title">Desirable Technical Skills</h1> 
                                {Object.keys(project).length > 0 && project.Skills.filter((userData)=>{
                                    return (userData.category === "technical")
                                }).length> 0 ? (project.Skills.filter((userData)=>{
                                    return (userData.category === "technical")
                                }).map((name)=>{
                                    return <span className="skills-dashboard">{name.name} </span> 
                                })): "No required skill. "}<br/><br/>
                                <h1 className="all-prjects-skills-title">Desirable Soft Skills</h1>
                                {Object.keys(project).length > 0 && project.Skills.filter((userData)=>{
                                        return (userData.category === "soft")
                                    }).length> 0 ? (project.Skills.filter((userData)=>{
                                        return (userData.category === "soft")
                                    }).map((name)=>{
                                        return <span className="skills-dashboard">{name.name} </span> 
                                    })): "No required skill."}<br/><br/>
                            </MDBCardText>
                            <MDBCardText>
                            <h1 className="all-prjects-skills-title">Acceptable Spoken languages</h1>
                            {Object.keys(project).length > 0 && project.Skills.filter((userData)=>{
                                    return (userData.category === "language")
                                }).length> 0 ? (project.Skills.filter((userData)=>{
                                    return (userData.category === "language")
                                }).map((name)=>{
                                    return <span className="skills-dashboard">{name.name} </span> 
                                })): "No required language."}
                            </MDBCardText>
                            <div className="flex-row ">
                                <a href="#!" className="card-link icon icon-all-projects-width">
                                 {project.isCompleted === false ? 
                                 (<><MDBIcon icon="lock-open green-text" /> Available</>) : 
                                 (<><MDBIcon icon="lock black-text" /> Unavailable</>)} <span>Project Status</span>
                                </a>
                                <a href="#!" className="card-link icon icon-all-projects-width"><MDBIcon icon="calendar-alt deep-purple-text" /> {Object.keys(project).length > 0 && project.publishedAt.slice(0, 10)} <span>Deadline</span>
                                </a>
                                {/* //todo GET PROJECT OWNER NAME ONTO CARD */}
                                <a href="#!" className="card-link icon icon-all-projects-width"><MDBIcon icon="user-alt black-text" /> <Link to={`/dashboard/public/${project.User.id}`}>{project.User.firstName} {project.User.lastName} <span>Project owner</span></Link>
                                </a>
                                <a href="#!" className="card-link icon icon-all-projects-width"><MDBIcon icon="users indigo-text" /> {project.memberLimit} <span>Member's limit</span> 
                                </a>
                                <Link to={`/projects/${project.id}`} className="card-link icon icon-all-projects-width"><i class="fas fa-comment-dots"></i> {comment && comment.length} <span>Comments</span> 
                                </Link>
                                
                                <div>
                                    {
                                        isOwner ?
                                        <button className=" inactive-own">
                                                You own this project
                                        </button>
                                        :
                                        isAccepted ?
                                        <>                                
                                            <button className="inactive-applied" disabled>
                                                You are in this project
                                            </button>
                                            
                                        </>    
                                            :
                                        isApplied ?
                                            <>                                
                                            <button className="inactive-applied" disabled>
                                                You applied to this project 
                                            </button>
                                            <button className='btn  cancel-application' onClick={cancelApply}>Cancel application</button>
                                        </> 
                                        :
                                        <button className=" participate-button" onClick={applyProject}>
                                                I want to be part of this project
                                            </button>
                                            
                                    }
                                    
                                    {/* {   
                                        applied ?                                
                                            <button className="inactive" disabled>
                                                Applied to this project!
                                            </button>
                                            
                                            :
                                            <button className="participate-button" onClick={applyProject}>
                                                I want to be part of this project
                                            </button>
                                    } */}
                                </div>
                            </div>
                            </aside>
                            </MDBCard>
                        </MDBCard>
                        {/* ============================================================================================== */}
                    </MDBCol>
                </MDBRow>
            </div>

           
        </div>
    )
}
