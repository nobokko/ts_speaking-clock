// import * as cronSettingParser from "./cron/settingParser";
import * as CronExecuter from "./cron/executer";

const synth = window.speechSynthesis;

const speakTaskA = (text: string | (() => string), log?: string, afterTask?: (params: { text: string, log?: string }) => void): CronExecuter.CronTask => {
    return () => {
        const te_xt = typeof text == "function" ? text() : text;
        console.log(log ?? te_xt);
        const utterThis = new SpeechSynthesisUtterance(te_xt);
        synth.speak(utterThis);
        if (afterTask) {
            afterTask({ text: te_xt, log });
        }
    };
};

const speakTaskB = (text: string): CronExecuter.CronTask => {
    return (crontime) => {
        console.log(crontime);
        const utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    };
};

const speakTaskC = (text: string, log?: string): CronExecuter.CronTask => {
    return () => new Promise((resolve) => {
        console.log(log ?? text);
        const utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
        resolve(null);
    });
};

CronExecuter.addEventListener("start", () => {
    synth.speak(new SpeechSynthesisUtterance(`開始します。`));
});

CronExecuter.addEventListener("beforeCheck", () => {
    console.debug('begin check.', new Date());
});

CronExecuter.addEventListener("afterCheck", (sleepTime: number) => {
    console.debug('end check.', sleepTime, new Date());
});

CronExecuter.addEventListener("beforeExecute", (id: number) => {
    console.debug('begin task.', id, new Date());
});

CronExecuter.addEventListener("afterExecute", (id: number) => {
    console.debug('end task.', id, new Date());
});

const formatLastCronExecute = (lastCronExecute: { [key: string]: (string | number) }) => {
    if (!lastCronExecute) {
        return 'undefined';
    }
    return `${lastCronExecute.月}/${lastCronExecute.日} ${lastCronExecute.時}:${lastCronExecute.分}(${lastCronExecute.曜日})`;
};

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
                newElement.innerText = `${id} - ${scheduleInfo.cronTime.original} - ${scheduleInfo.nextDate} - ${formatLastCronExecute(scheduleInfo.lastCronExecute)}`
                newElement.setAttribute('data-schedule-id', `${id}`);
                console.info(scheduleInfo.cronTime.original, scheduleInfo.nextDate, formatLastCronExecute(scheduleInfo.lastCronExecute));
                tastListElement.appendChild(newElement);
            }
        });
    }
    document.querySelectorAll('#task_list>[removed]').forEach(ele => {
        ele.remove();
    });
});

CronExecuter.append('0 * * * *', speakTaskA(() => {
    const dt = new Date();
    return `${dt.getHours()}時です。`;
}, '時報', (params) => {
    globalThis.document.querySelector('body').appendChild((() => {
        const e = globalThis.document.createElement('div');
        e.innerText = params.text;
        return e;
    })());
}), '時報');

CronExecuter.append('30 * * * *', speakTaskA(`30分です。`, '半時報'), '半時報');

CronExecuter.append('15,45 * * * *', speakTaskB(`やっほー。`), '四半時報');

CronExecuter.append('*/5 * * * *', speakTaskC(`五分経過。`, '五分毎'), '五分毎');

CronExecuter.append('*/3 * * * *', speakTaskA(`三分経過。`, '三分毎'), '三分毎');

CronExecuter.append('*/7 * * * *', () => {
    console.log('7分毎');
}, '7分毎');

CronExecuter.start();
