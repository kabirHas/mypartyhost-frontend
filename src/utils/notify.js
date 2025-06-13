import { toast } from 'react-toastify';
const notify = (message, type ) => toast(message, {type})

export default class Notifier {
    static success(message){
        notify(message, 'success')
    }
    static info(message){
        notify(message, 'info')
    }
    static warn(message){
        notify(message, 'warn')
    }
    static error(message){
        notify(message, 'error')
    }
}
