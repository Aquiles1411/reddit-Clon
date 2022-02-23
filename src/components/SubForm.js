import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { getSubs } from '../action/index'
import Sidebar from './Sidebar'
import { axiosWithAuth } from '../utils/axiosWithAuth'

function SubForm(props) {
    const history = useHistory()
    const [subName, setSubName] = useState('')

    const changeHandler = (e) => {
        setSubName(e.target.value)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        if (!subName) {
            alert("El nombre del subreddit no puede estar en blanco")
            return
        }

        if (props.subreadits.find(item => item.name === subName)) {
            alert(`El subreadit "${subName}" subreadit ya existe! `)
            return
        }

        axiosWithAuth().post("/r/", { name: subName })
            .then(res => {
                props.getSubs(res.data)
                history.push('/')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="subForm-container">

            <form className="subForm" onSubmit={submitHandler}>
                <div className="createSub">Crear un nuevo subreddit</div>
                <input
                    type="text"
                    name="name"
                    value={subName}
                    onChange={changeHandler}
                    placeholder="Ingrese un nuevo subreddit"
                />
                {props.loggedIn ?
                    <button className="subForm-button">
                        submit
                    </button> : <div className="err-msg">Es necesario estar <Link to='/login'>loggeado</Link> para agregar un nuevo subreadit</div>
                }
            </form>
            <div className="side">
                <Sidebar />
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        subreadits: state.subreadits,
        loggedIn: state.loggedIn
    }
}

export default connect(mapStateToProps, { getSubs })(SubForm)

