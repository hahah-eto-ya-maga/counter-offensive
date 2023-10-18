import React from "react"
import { useState } from "react";
import { Button } from "../../UI"
import { flag} from "../../../pages/LobbiPage/images";
import cn from "classnames";
import './FlagBearer.css'

const FlagBearer: React.FC = () => {
    let [statusFlag, setStatusFlag] = useState(false)
    const changeStatusFlag = () => {
        setStatusFlag(true)
        
        // отправка статуса на сервер
        
    }

    return(
            <Button className="flag" appearance="image" onClick={changeStatusFlag}> Знаменосец {'('}
                    <span className={cn("status", {
                        ["free"]: !statusFlag,
                        ["selected"]: statusFlag,
                    })}>{statusFlag ? "Занято" : "Свободно"}</span>{')'}
                    <img src={flag} alt="Flag" /></Button>
    )
}

export default FlagBearer;