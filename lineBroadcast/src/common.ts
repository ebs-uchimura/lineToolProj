/**
 * common.ts
 **
 * function：LINE broadcast client
 **/

// node counter
let nodecounter: number = 0;
// channelname
const channelnameDom: any = document.getElementById("channelname");
// channel-select
const channelselectDom: any = document.getElementById("channel-select");
// token
const tokenDom: any = document.getElementById("token");
// broadcastname
const broadcastnameDom: any = document.getElementById("broadcastname");
// CSVfile
const csvfileDom: any = document.getElementById("csvfilepath");
// planname
const plannameDom: any = document.getElementById("planname");
// plan-select
const planselectDom: any = document.getElementById("plan-select");
// linemethod-select'
const linemethodselectDom: any = document.getElementById("linemethod-select");
// genrename
const genrenameDom: any = document.getElementById("genrename");
// genre-select
const genreselectDom: any = document.getElementById("genre-select");
// single
const imageSingleDom: any = document.getElementById("single");
// clear
const imageClearDom: any = document.getElementById("clearimagearea");
// imageselect
const imageSelectDom: any = document.getElementById("selectimagearea");
// defaulturl
const defaultTransferAreaDom: any =
  document.getElementById("defaultransferarea");
// defaulturlhead
const displayTextAreaDom: any = document.getElementById("displaytextarea");
// baseurl
const baseurlDom: any = document.getElementById("defaulturl");
// channelname
const imagerowDoms = document.querySelectorAll<HTMLElement>(".imagerow");

// operation_finish
(window as any).api.on("operation_finish", (arg: any) => {
  try {
    // item
    switch (arg) {
      // broadcast
      case "broadcast":
        // initialize
        broadcastnameDom.value = "";
        csvfileDom.innerHTML = "";
        channelselectDom.options[0].selected = true;
        planselectDom.options[0].selected = true;
        break;

      // plan
      case "plan":
        // initialize
        plannameDom.value = "";
        genreselectDom.options[0].selected = true;
        linemethodselectDom.options[0].selected = true;
        break;

      // channel
      case "channel":
        // initialize
        channelnameDom.value = "";
        tokenDom.value = "";
        break;

      // genre
      case "genre":
        // initialize
        genrenameDom.value = "";
        break;

      default:
        // error
        console.log(`Sorry, we are out of ${arg}.`);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// delete_finish
(window as any).api.on("delete_finish", (arg: any) => {
  try {
    // item
    switch (arg.name) {
      // plan
      case "plan":
        // no error
        if (arg.data != "error") {
          // clear plan
          planselectDom.innerText = null;
          // tmpoption
          const tmpPlanOption: any = document.createElement("option");
          // value
          tmpPlanOption.value = "0";
          // textcontent
          tmpPlanOption.textContent = "--プラン選択--";
          // add to selector
          planselectDom.appendChild(tmpPlanOption);
          // if not empty
          if (arg.data.length > 0) {
            // plan
            arg.data.forEach((obj: any) => {
              // option
              const option: any = document.createElement("option");
              // value
              option.value = String(obj.id);
              // textcontent
              option.textContent = `${obj.id}: ${obj.planname}`;
              // add to selector
              planselectDom.appendChild(option);
            });
          }
        } else {
          // error
          console.log(arg.data);
        }
        // initialize
        planselectDom.options[0].selected = true;
        break;

      // channel
      case "channel":
        // no error
        if (arg.data != "error") {
          // clear channel
          channelselectDom.innerText = null;
          // tmpoption
          const tmpChannelOption: any = document.createElement("option");
          // value
          tmpChannelOption.value = "0";
          // textcontent
          tmpChannelOption.textContent = "--チャンネル選択--";
          // add to selector
          channelselectDom.appendChild(tmpChannelOption);
          // if not empty
          if (arg.data.length > 0) {
            // channel
            arg.data.reverse().forEach((obj: any) => {
              // option tag
              const option: any = document.createElement("option");
              // value
              option.value = String(obj.id);
              // textcontent
              option.textContent = `${obj.id}: ${obj.channelname}`;
              // add to selector
              channelselectDom.appendChild(option);
            });
          }
        } else {
          // error
          console.log(arg.data);
        }
        // initialize
        channelselectDom.options[0].selected = true;
        break;

      // genre
      case "genre":
        // error
        if (arg.data != "error") {
          // clear genre
          genreselectDom.innerText = null;
          // tmpoption
          const tmpGenreOption: any = document.createElement("option");
          // value
          tmpGenreOption.value = "0";
          // textcontent
          tmpGenreOption.textContent = "--ジャンル選択--";
          // add to selector
          genreselectDom.appendChild(tmpGenreOption);
          // if not empty
          if (arg.data.length > 0) {
            // genre
            arg.data.forEach((obj: any) => {
              // option
              const option: any = document.createElement("option");
              // value
              option.value = String(obj.id);
              // genrename
              option.textContent = `${obj.id}: ${obj.genrename}`;
              // add to options
              genreselectDom.appendChild(option);
            });
          }
        } else {
          // error
          console.log(arg.data);
        }
        // initialize
        genreselectDom.options[0].selected = true;
        break;

      default:
        // error
        console.log(`Sorry, we are out of ${arg}.`);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// genre
(window as any).api.on("genreMasterlist", (arg: any) => {
  try {
    // error
    if (arg != "error") {
      // genre
      arg.forEach((obj: any) => {
        // option
        const option: any = document.createElement("option");
        // value
        option.value = String(obj.id);
        // genrename
        option.textContent = obj.genrename;
        // add to options
        genreselectDom.appendChild(option);
      });
    } else {
      // error
      console.log(arg);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// lineMethodMasterlist
(window as any).api.on("lineMethodMasterlist", (arg: any) => {
  try {
    // error
    if (arg != "error") {
      // linemethod
      arg.reverse().forEach((obj: any) => {
        // option tags
        const option: any = document.createElement("option");
        // value
        option.value = String(obj.id);
        // textContent
        option.textContent = obj.linemethodname;
        // add to options
        linemethodselectDom.appendChild(option);
      });
    } else {
      // error
      console.log(arg);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// plan
(window as any).api.on("planMasterllist", (arg: any) => {
  try {
    // error
    if (arg != "error") {
      // plan
      arg.forEach((obj: any) => {
        // option
        const option: any = document.createElement("option");
        // value
        option.value = String(obj.id);
        // textcontent
        option.textContent = `${obj.id}: ${obj.planname}`;
        // add to selector
        planselectDom.appendChild(option);
      });
    } else {
      // error
      console.log(arg);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// channel
(window as any).api.on("channelMasterllist", (arg: any) => {
  try {
    // error
    if (arg != "error") {
      // channel
      arg.reverse().forEach((obj: any) => {
        // option tag
        const option: any = document.createElement("option");
        // value
        option.value = String(obj.id);
        // textcontent
        option.textContent = `${obj.id}: ${obj.channelname}`;
        // add to selector
        channelselectDom.appendChild(option);
      });
    } else {
      // error
      console.log(arg);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// users
(window as any).api.on("usersCsvlist", (arg: any) => {
  try {
    // error
    if (arg != "error") {
      // userArray
      const userArray: any[] = arg.record;
      // serializedArray
      const serializedArray: any = JSON.stringify(userArray);
      // localStorage
      localStorage.setItem("userArray", serializedArray);
      // filepath
      csvfileDom.innerHTML = arg.filename;
    } else {
      // error
      console.log(arg);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// image
(window as any).api.on("image", (arg: any) => {
  try {
    // clear localStorage
    localStorage.clear();
    // save localStorage
    localStorage.setItem("imageArray", arg.allpath);
    // image registerd
    imageSingleDom.innerHTML = "済";
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// no data
(window as any).api.on("notexists", (arg: any) => {
  try {
    // show error
    showErrorMessage("fatal", arg);
    // back
    history.back();
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// plan initialize
(window as any).api.on("planInitialize", (arg: any) => {
  try {
    // initialize
    imagerowDoms.forEach((element) => (element.style.display = "none"));
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
});

// ※genre
// upload
const upload = (flg: boolean): void => {
  try {
    // upload
    (window as any).api.send("upload", flg);
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// clear upload
const clearUpload = (): void => {
  try {
    // clear localStorage
    localStorage.clear();
    // image registerd
    imageSingleDom.innerHTML = "画像選択";
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// CSVmode
const readCSV = (): void => {
  try {
    // CSV mode
    (window as any).api.send("csv");
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// CSV clear
const clearCSV = (): void => {
  try {
    // clear localStorage
    localStorage.clear();
    // clear file path
    csvfileDom.innerHTML = "";
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// immediate broadcast
const broadcast = (): void => {
  try {
    // broadcast name
    let broadcastname: string = broadcastnameDom.value;
    // error flg
    let errorflg: boolean = false;
    // error message
    let errorArray: string[] = [];
    // user list
    let userArray: any;
    // localstorage
    const serializedArray: any = localStorage.getItem("userArray");
    // channel
    const channel: string = channelselectDom.value;
    // planid
    const planId: string = planselectDom.value;

    /* validation */
    // broadcastname
    if (broadcastname == "") {
      errorArray.push("配信名が空欄です");
      errorflg = true;
    }
    // channel
    if (channelselectDom.options[0].selected) {
      errorArray.push("チャネルを選択してください");
      errorflg = true;
    }
    // plan
    if (planselectDom.options[0].selected) {
      errorArray.push("プランを選択してください");
      errorflg = true;
    }
    // no user
    if (!serializedArray) {
      errorArray.push("顧客CSVを選択してください");
      errorflg = true;
    } else {
      // convert JSONstring
      userArray = JSON.parse(serializedArray);
    }

    // no error
    if (!errorflg) {
      // message obj
      const broadcastObj: any = {
        bdname: broadcastname, // broadcast name
        channel: channel, // channel
        plan: planId, // plan
        users: userArray, // user list
      };
      // broadcast
      (window as any).api.send("broadcast", broadcastObj);
    } else {
      // show error
      showErrorMessage("error", errorArray);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// ※registration
// regist plan
const planregister = (e: any): void => {
  try {
    // avoid double click
    e.preventDefault();
    // defaulturlhead
    const displayTextDom: any = document.getElementById("plantextarea");
    // error flg
    let errorflg: boolean = false;
    // url array
    let tmpUrlArray: any[] = [];
    // error array
    let errorArray: string[] = [];
    // genre
    const genre: string = genreselectDom.value ?? "";
    // image path list
    const imgPathArray: any = localStorage.getItem("imageArray")?.split(",");
    // plan name
    const planname: string = plannameDom.value ?? "";
    // base url
    const baseUrl: string = baseurlDom.value ?? "";
    // tmpText
    const tmpText: string = displayTextDom.value ?? "";
    // line method
    const linemethod: number = linemethodselectDom.value ?? 0;

    /* validation */
    // planname
    if (planname == "") {
      // error
      errorArray.push("プラン名が空欄です");
      errorflg = true;
    }
    // genre
    if (genreselectDom.options[0].selected) {
      // error
      errorArray.push("ジャンルを選択してください");
      errorflg = true;
    }
    // linemethod
    if (linemethodselectDom.options[0].selected) {
      // error
      errorArray.push("配信タイプを選択してください");
      errorflg = true;
    }

    // other than image mode
    // text
    if (tmpText == "") {
      // error
      errorArray.push("テキストが空欄です");
      // error flg
      errorflg = true;
    }

    // no error
    if (!errorflg) {
      // message obj
      const sendObj: any = {
        planname: planname, // planname
        linemethod: linemethod, // linemethod
        baseurl: baseUrl, // baseUrl
        textSet: tmpText, // tmpText
        urlSet: tmpUrlArray, // tmpUrlArray
        genre: genre, // genre
        imagedata: imgPathArray, // imgPathArray
      };
      // send obj
      const finalSendObj = JSON.parse(JSON.stringify(sendObj));
      // broadcast mode
      (window as any).api.send("planregister", finalSendObj);
    } else {
      // show error
      showErrorMessage("error", errorArray);
    }

    // empty default url
    baseurlDom.value = "";
    // image registerd
    imageSingleDom.innerHTML = "画像選択";
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// channel
const channelregister = (): void => {
  try {
    // channelname
    let channelname: string;
    // token
    let token: string;
    // errorflg
    let errorflg: boolean = false;
    // errorArray
    let errorArray: string[] = [];
    // channelname
    channelname = channelnameDom.value;
    // token
    token = tokenDom.value;

    /* validation */
    // channelname
    if (channelname == "") {
      // error
      errorArray.push("チャンネル名が空欄です");
      errorflg = true;
    }
    // token
    if (token == "") {
      // error
      errorArray.push("トークンが空欄です");
      errorflg = true;
    }

    // error flg
    if (!errorflg) {
      // send obj
      const sendObj: any = {
        channelname: channelname, // channel
        token: token, // token
      };
      // regist channel
      (window as any).api.send("channelregist", sendObj);
    } else {
      // error
      (window as any).api.send("error", errorArray.join("|"));
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// genre
const genreregister = (): void => {
  try {
    // genrename
    let genrename: string;
    // error
    let errorflg: boolean = false;
    // error array
    let errorArray: string[] = [];
    // set genrename
    genrename = genrenameDom.value;

    /* validation */
    // genrename
    if (genrename == "") {
      // error
      errorArray.push("ジャンル名が空欄です");
      // error flg
      errorflg = true;
    }

    // no error
    if (!errorflg) {
      // genre registration
      (window as any).api.send("genreregister", genrename);
    } else {
      // show error
      showErrorMessage("error", errorArray);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// delete
const deleteit = (table: string): void => {
  try {
    // table index
    let tableIdx: number = 0;
    // ID
    let tableid: string = "";
    // table option
    let tableoption: string = "";

    // item
    switch (table) {
      // plan
      case "plan":
        // selected plan index
        tableIdx = planselectDom.selectedIndex;
        // table plan id
        tableid = planselectDom.options[tableIdx].value;
        // table plan option
        tableoption = planselectDom.options[tableIdx].innerHTML;
        break;

      // channel
      case "channel":
        // selected channel index
        tableIdx = channelselectDom.selectedIndex;
        // selected channel id
        tableid = channelselectDom.options[tableIdx].value;
        // table option
        tableoption = channelselectDom.options[tableIdx].innerHTML;
        break;

      // genre
      case "genre":
        // selected genre index
        tableIdx = genreselectDom.selectedIndex;
        // selected genre id
        tableid = genreselectDom.options[tableIdx].value;
        // table option
        tableoption = genreselectDom.options[tableIdx].innerHTML;
        break;

      // default
      default:
        console.log(`Sorry, we are out of ${table}.`);
    }

    // no plan
    if (tableIdx == 0) {
      // show error
      showErrorMessage("error", ["ヘッダは削除できません。"]);
      // error
      throw new Error("no plan exists");
    }

    // sendObj
    const sendObj: any = {
      table: table, // table
      id: tableid, // ID
      name: tableoption, // name
    };
    // delete
    (window as any).api.send("delete", sendObj);
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// clear form
const clearform = () => {
  try {
    // number
    let num: number = 0;
    // form table
    const formTableDom: any = document.getElementById("formTable");
    // rowCount
    const rowCount: number = formTableDom.rows.length;
    // deletecount
    const deletecount: number = rowCount - num;

    // delete all
    if (num < rowCount) {
      for (let i = 0; i < deletecount; i++) {
        formTableDom.tBodies[0].deleteRow(-1);
      }
    }
    // nodecounter
    nodecounter = 0;
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// change select box
const linemethodchange = (obj: any): void => {
  try {
    // initialize counter
    nodecounter = 0;
    // idx
    const idx: number = obj.selectedIndex;
    // value
    const value: string = obj.options[idx].value;

    // value
    switch (value) {
      // text mode
      case "1":
        // id
        imageSelectDom.style.display = "none";
        imageSingleDom.style.display = "none";
        imageClearDom.style.display = "none";
        defaultTransferAreaDom.style.display = "none";
        displayTextAreaDom.style.display = "table-row";
        break;

      // image mode
      case "2":
        // id
        imageSelectDom.style.display = "table-row";
        imageSingleDom.style.display = "table-row";
        imageClearDom.style.display = "table-row";
        defaultTransferAreaDom.style.display = "table-row";
        displayTextAreaDom.style.display = "table-row";
        break;

      default:
        console.log(`Sorry, we are out of ${value}.`);
    }
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// page transfer
const transfer = (channel: string): void => {
  try {
    // page
    (window as any).api.send("page", channel);
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// exit app
const exitApp = (): void => {
  try {
    // exit app
    (window as any).api.send("exit", "");
  } catch (e: unknown) {
    // error
    if (e instanceof Error) {
      // error
      console.log(e.message);
    }
  }
};

// show error message
const showErrorMessage = (type: string, errorArray?: string[]): void => {
  // error messages
  const errors: string = errorArray ? errorArray.join("|") : "";
  //  message obj
  const messageOption: any = {
    title: "error", // broadcast name
    message: errors, // message body
    type: type, // error
  };
  // show error
  (window as any).api.send("showmessage", messageOption);
};
