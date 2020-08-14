import React, { Component } from "react";
import { Card, CardImg, CardBody,CardText, Button, Modal, ModalHeader, ModalBody, Label, Row, Col, CardTitle, Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from "./LoadingComponent";
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

// Function to Render Comments
function RenderComments({comments, postComment, dishID}) {
    if (comments == null) {
        return (<div></div>)
    }  

    const commts = comments.map(comment => {
        return(
            <Fade in>
                <li key={comment.id} >
                        <p>{comment.comment}</p>
                        <p>--{comment.author},
                        {new Intl.DateTimeFormat('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit'
                        }).format(new Date(Date.parse(comment.date)))}
                        </p>
                </li>
            </Fade>
        )
    });
    return(
            <div>
                <h4>Comments</h4>
                <ul className="list-unstyled">
                    <Stagger in>
                        {commts}
                    </Stagger>
                </ul>
                <CommentForm dishID={dishID} postComment={postComment} />
            </div>
    );
}

// Rendering Dish
function RenderDish({dish}) {
    if (dish != null) {
        return(
            <FadeTransform in 
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }} >
                <Card>
                    <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        )
    }
    else{
        return(
            <div></div>
        )
    }
}

// Dishdetail Component
const Dishdetail = (props) => {
    const dish = props.dish;
    if(props.isLoading) {
        return(
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if(props.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    else if (dish == null) {
        return (<div></div>)
    }
    return (
        <div className="container">
            <div className="row">
                <Breadcrumb>
                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish}/>
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments} postComment={props.postComment} dishID={props.dish.id} />
                </div>            
            </div>
        </div>
    )
}

// Implementing "Submit Comment" & Applying Form Validation 
const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length < len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isModelOpen: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModelOpen: !this.state.isModelOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishID, values.rating, values.author, values.comment);
    }

    render() {
        return(
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"></span> Submit Comment
                </Button>

                <Modal isOpen={this.state.isModelOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label for="rating" md={12}>Rating</Label>
                                <Col md={12}>
                                    <Control.select model=".rating" name="rating" id="rating" defaultValue="1" className="form-control">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="author" md={12}>Your Name</Label>
                                <Col md={12}>
                                <Control.text model=".author" id="author" name="author" 
                                    placeholder="Your Name" 
                                    className="form-control" 
                                    validators={{
                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                    }} />
                                <Errors className="text-danger" model=".author" show="touched"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="feedback" md={2}>Comment</Label>
                                <Col md={12}>
                                <Control.textarea model=".comment" id="comment" name="comment" 
                                    resize="none"
                                    rows="6" 
                                    className="form-control" 
                                    validators={{
                                        required,
                                    }} />
                                <Errors className="text-danger" model=".comment" show="touched"
                                    messages={{
                                        required: 'Required'
                                    }} />
                                </Col>
                            </Row>
                            <Button type="submit" value="submit" color="primary">Submit</Button>                            
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default Dishdetail;