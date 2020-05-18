import React from 'react'
import { Spinner } from "reactstrap"

const CustomSpinner = () => {
    return(
        <div className="spinnerWrapper">
            <Spinner className={"spinnerCommon"} />
        </div>
    )
}

export default CustomSpinner