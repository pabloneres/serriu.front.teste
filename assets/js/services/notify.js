import { notification } from 'antd'
function Notify(type, title, message) {
    switch (type) {
      case 'error':
        return notification[type]({
          message: title,
          description: message,
          placement: 'bottomRight',
          style: { backgroundColor: '#fff2f0', borderWidth: 1, border: 'solid #ffccc7' }
        });
      case 'success':
        return notification[type]({
          message: title,
          description: message,
          placement: 'bottomRight',
          style: { backgroundColor: '#f6ffed', borderWidth: 1, border: 'solid #b7eb8f' }
        });
  
      default:
        break;
    }
  
  }

export default Notify