import React, { useEffect } from "react";
import { Button } from "antd";

import png from "../assets/test.png";
import styles from "./index.module.less";

const App = () => {
  useEffect(() => {
    console.log(process.env);
    document.title = process.env.test || "";
  }, []);

  return (
    <>
      <img className={styles.png} src={png} />
      <div className={styles.main}>
        <div className={styles.top}>
          <Button
            onClick={() => {
              throw new Error("hhh");
            }}
          >
            点击
          </Button>
        </div>
        <div className={styles.bottom}>
          <div className={styles.inner}></div>
        </div>
      </div>
    </>
  );
};

export default App;
