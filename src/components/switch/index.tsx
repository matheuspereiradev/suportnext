import styles from "./style.module.scss";
import Link from 'next/link';
import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

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