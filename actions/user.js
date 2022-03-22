import axios from 'axios'
import {setUser} from "../reducers/userReducer";

export const submit = (email,pass) =>
{
    return async dispatch => {
        try {
           const response = await axios.post('http://cceapi2.2050.digital/login?username='+email+'&password='+pass , {

            })
          //  await  fetch('http://cceapi2.2050.digital/login?username=idanilov&password=$26$B3bYc' ,
            //    { method: 'POST', // *GET, POST, PUT, DELETE, etc.
           //     mode: 'no-cors', // no-cors, *cors, same-origin
             //   cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
             //   credentials: 'same-origin', // include, *same-origin, omit
           //     headers: {
           //     'Content-Type': 'application/json',
          //  },
             //      redirect: 'follow', // manual, *follow, error
             //   referrerPolicy: 'no-referrer', // no-referrer, *client
              //      data : {'username': 'email',
              //                                'password': 'password'},


               // }).then(response =>  console.log(response.text()))

            console.log('token',response.data)
               // dispatch(setUser(response.data))
               // localStorage.setItem('token', response.date)

        //    const response = await axios({
        //        method: 'post',
       //         'mode': 'cors',
        //        headers: { 'Content-Type': 'application/json' },
        //        url: 'http://cceapi2.2050.digital/logine',
        //        data : {username: "email",
         //                        password: "password"}
        //    })

        } catch (e) {
            alert(e)
        }
    }



}