// import * as cronSettingParser from "./cron/settingParser";
import * as CronExecuter from "./cron/executer";

console.log("Hello World!");

CronExecuter.start();

const synth = window.speechSynthesis;

synth.speak(new SpeechSynthesisUtterance(`開始します。`));

CronExecuter.append('0 * * * *', () => {
    console.log('時報');
    const dt = new Date();
    const utterThis = new SpeechSynthesisUtterance(`${dt.getHours()}時です。`);
    synth.speak(utterThis);
}, '時報');

CronExecuter.append('* * * * *', () => {
    const dt = new Date();
    console.log(`${dt.getHours()}時です。`);
    const utterThis = new SpeechSynthesisUtterance(`${dt.getHours()}時です。`);
    synth.speak(utterThis);
}, 'x時報x');

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
