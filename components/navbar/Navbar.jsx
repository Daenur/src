
import { LOCALES } from './translations/locales'
import {messages} from "../../translations/messages";
import { IntlProvider } from 'react-intl'
import React, { useState,useEffect }  from 'react';
import {NavLink} from "react-router-dom"
import face from '../../assets/img/face.svg'
import logoAuto from '../../assets/img/logoAuto.svg'
import '../login.css'
const languages = [
    { name: 'EN', code: LOCALES.ENGLISH },
    { name: 'RU', code: LOCALES.RUSSIAN },
    { name: 'IN', code: LOCALES.INDIAN }
]



const Navbar=()=>
{
    const [locale, setLocale] = useState(LOCALES.ENGLISH)

  return (

      <div className="switcher">
          <IntlProvider
              messages={messages[locale]}
              locale={locale}>
              <img src={logoAuto} className='logoSwitcher'/>
          <select onChange={evt => this.localeChange(evt)}>
              {languages.map(({ name, code }) => (
                  <option key={code} value={code}  >
                      {name}
                  </option>
              ))}
          </select>
              <div className="navbar_login"><NavLink to='/'><img src={face} className='face'/></NavLink></div>
          </IntlProvider>
          </div>
  );


};
export default Navbar;