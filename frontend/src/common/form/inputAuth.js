import React from 'react'

import TextField from 'material-ui/TextField'
import If from '../operator/if'

export default props => ( <
    <If test = {!props.hide }>
    	<TextField 
    		hintText = {props.label}
    		floatingLabelText = {props.label} 
    		type = {props.type}
    		{...props } />  
    </If>
)