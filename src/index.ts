// import * as cronSettingParser from "./cron/settingParser";
import * as CronExecuter from "./cron/executer";

const synth = window.speechSynthesis;

CronExecuter.addEventListener("start", () => {
    synth.speak(new SpeechSynthesisUtterance(`開始します。`));
});

CronExecuter.addEventListener("beforeExecute", () => {
    console.debug('begin task.');
});

CronExecuter.addEventListener("afterExecute", () => {
    console.debug('end task.');
});

CronExecuter.addEventListener("update", () => {
    console.debug('sorted.');
    const status = CronExecuter.status();
    console.info(status.schedule);
    const tastListElement = document.querySelector('#task_list');
    document.querySelectorAll('#task_list>*').forEach(ele => {
        ele.setAttribute('removed', "1");
    });
    if (status.schedule.length) {
        status.schedule.forEach(id => {
            const scheduleInfo = CronExecuter.info(id);
            if (scheduleInfo) {
                const newElement = document.createElement('div');
                newElement.innerText = `${id} - ${scheduleInfo.cronTime.original} - ${scheduleInfo.nextDate}`;
                console.info(scheduleInfo.cronTime.original, scheduleInfo.nextDate);
                tastListElement.appendChild(newElement);
            }
        });
    }
    document.querySelectorAll('#task_list>[removed]').forEach(ele => {
        ele.remove();
    });
});

CronExecuter.append('0 * * * *', () => {
    console.log('時報');
    const dt = new Date();
    const utterThis = new SpeechSynthesisUtterance(`${dt.getHours()}時です。`);
    synth.speak(utterThis);
    globalThis.document.querySelector('body').appendChild((() => {
        const e = globalThis.document.createElement('div');
        e.innerText = utterThis.text;
        return e;
    })());
}, '時報');

CronExecuter.append('30 * * * *', () => {
    console.log('半時報');
    const utterThis = new SpeechSynthesisUtterance(`30分です。`);
    synth.speak(utterThis);
}, '半時報');

CronExecuter.append('15,45 * * * *', (cronsetting) => {
    console.log(cronsetting);
    const utterThis = new SpeechSynthesisUtterance(`やっほー。`);
    synth.speak(utterThis);
}, '四半時報');

CronExecuter.append('*/5 * * * *', () => {
    return new Promise((resolve, reject) => {
        console.log('五分毎');
        const utterThis = new SpeechSynthesisUtterance(`五分経過。`);
        synth.speak(utterThis);
        resolve(null);
    });
}, '五分毎');

CronExecuter.append('*/3 * * * *', () => {
    console.log('三分毎');
    const utterThis = new SpeechSynthesisUtterance(`三分経過。`);
    synth.speak(utterThis);
}, '三分毎');

CronExecuter.start();
