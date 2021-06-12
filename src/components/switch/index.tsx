import styles from "./style.module.scss";
import { useState } from "react";

interface SwitchProperties {
    checked: boolean
}

export function Switch({ checked }: SwitchProperties) {
    const [isChecked, setIsChecked] = useState<boolean>(checked)
    return (
        <>
            {
                <label className={styles.switch}>
                    <input type="checkbox" checked={isChecked} onClick = {()=>{setIsChecked(!isChecked)}}/>
                    <span className={styles.slider}></span>
                </label>
            }
        </>
    );

}