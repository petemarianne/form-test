import React, { useState } from 'react';
import './App.sass';
import { replaceAt } from './utils/replaceAt';

interface Values {
    'name': string,
    'email': string,
    'phone': string,
    'date': string,
    'message': string
}

const initialValues: Values = {
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
};

const initialErrors: Values = {
    name: 'error',
    email: 'error',
    phone: 'error',
    date: 'error',
    message: 'error',
};

enum Success {
    NoRes,
    Successful,
    Unsuccessful
}

const App: React.FC = (): JSX.Element => {
    const [values, setValues] = useState<Values>(initialValues);
    const [errors, setErrors] = useState<Values>(initialErrors);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<Success>(Success.NoRes);

    const validateName = (name: string): boolean => {
        if (!name) {
            setErrors(prevState => ({...prevState, name: 'Enter your name!'}));
            return false;
        } else setErrors(prevState => ({...prevState, name: 'error'}));
        if (/[^A-Za-z ]/.test(name)) {
            setErrors(prevState => ({...prevState, name: 'There should be only Latin letters in a name or a surname!'}));
            return false;
        } else setErrors(prevState => ({...prevState, name: 'error'}));
        if (/^ /.test(name)) {
            setErrors(prevState => ({...prevState, name: 'There should be only one space between a name and a surname!'}));
            return false;
        } else {
            if (!/^\w{2}\w+/.test(name)) {
                setErrors(prevState => ({...prevState, name: 'Your name must contain at least 3 symbols!'}));
                return false;
            } else if (/^\w{30}\w+/.test(name)) {
                setErrors(prevState => ({...prevState, name: 'Your name must contain a maximum of 30 symbols!'}));
                return false;
            } else setErrors(prevState => ({...prevState, name: 'error'}));
            if (/^\w+ ?$/.test(name)) {
                setErrors(prevState => ({...prevState, name: 'Enter your surname!'}));
                return false;
            } else {
                if (!/^\w+ \w+$/.test(name)) {
                    setErrors(prevState => ({...prevState, name: 'There should be only one space between name and surname!'}));
                    return false;
                } else {
                    if (!/^\w+ \w{2}\w+$/.test(name)) {
                        setErrors(prevState => ({...prevState, name: 'Your surname must contain at least 3 symbols!'}));
                        return false;
                    } else if (/^\w+ \w{30}\w+$/.test(name)) {
                        setErrors(prevState => ({...prevState, name: 'Your surname must contain a maximum of 30 symbols!'}));
                        return false;
                    } else setErrors(prevState => ({...prevState, name: 'error'}));
                }
            }
        }
        return true;
    }

    const validateEmail = (email: string): boolean => {
        if (!email) {
            setErrors(prevState => ({...prevState, email: 'Enter your email!'}));
            return false;
        } else setErrors(prevState => ({...prevState, email: 'error'}));
        if (!/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
            setErrors(prevState => ({...prevState, email: 'Incorrect email!'}));
            return false;
        } else setErrors(prevState => ({...prevState, email: 'error'}));
        return true;
    }

    const validateDate = (date: string): boolean => {
        if (!date) {
            setErrors(prevState => ({...prevState, date: 'Enter your birthday!'}));
            return false;
        } else setErrors(prevState => ({...prevState, date: 'error'}));
        if (new Date().getTime() < new Date(date).getTime()) {
            setErrors(prevState => ({...prevState, date: 'You can\'t enter future date!'}));
            return false;
        } else setErrors(prevState => ({...prevState, date: 'error'}));
        return true;
    }

    const validateMessage = (message: string): boolean => {
        if (!message) {
            setErrors(prevState => ({...prevState, message: 'Enter your message!'}));
            return false;
        } else setErrors(prevState => ({...prevState, message: 'error'}));
        if (message.length < 10) {
            setErrors(prevState => ({...prevState, message: 'Your message must contain at least 10 symbols!'}));
            return false;
        } else setErrors(prevState => ({...prevState, message: 'error'}));
        if (message.length > 300) {
            setErrors(prevState => ({...prevState, message: 'Your message must contain a maximum of 300 symbols!'}));
            return false;
        } else setErrors(prevState => ({...prevState, message: 'error'}));
        return true;
    }

    const validateAll = (): boolean => {
        for (let value of Object.values(values)) if (value === '') return false;
        for (let error of Object.values(errors)) if (error !== 'error') return false;
        return true;
    }

    const handleName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValues(prevState => ({...prevState, name: event.target.value.toUpperCase()}));
        validateName(event.target.value);
    }

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValues(prevState => ({...prevState, email: event.target.value}));
        validateEmail(event.target.value)
    }

    const setPhoneValue = (value: string): string => {
        if (value.length === 1 && !/[^0-9]/.test(value)) return `+7 (${value}__) ___-__-__`;
        if (value.length === 17) {
            const _ = value.indexOf('_');
            if (_ === -1 && values.phone.indexOf('_') === -1) return value + '_';
            if (_ === -1 && values.phone.indexOf('_') === 17) return replaceAt(value, 16, '_') + '_';
            value += '_';
            if (_ === 5) return '';
            if (_ === 9) return replaceAt(value, 6, '_');
            if (_ === 13 || _ === 16) return replaceAt(value,_ - 2,'_')
            if (_ === 10 || _ === 11 || _ === 6 || _ === 14) return replaceAt(value, _ - 1, '_');
        }
        if (/[^0-9]/.test(value.charAt(18))) return value.substring(0, value.length - 1);
        return value.indexOf('_') === -1 ? value.substring(0, value.length - 1) : replaceAt(value, value.indexOf('_'), value.charAt(value.length - 1)).substring(0, value.length - 1);
    }

    const handlePhone = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setValues(prevState => ({...prevState, phone: setPhoneValue(value)}));
        if ((value.indexOf('_') !== -1 && value.indexOf('_') !== 17) || value.length === 1 || !value.length) setErrors(prevState => ({...prevState, phone: 'Enter your phone!'}));
        else setErrors(prevState => ({...prevState, phone: 'error'}));
    }

    const handleDate = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setValues(prevState => ({...prevState, date: event.target.value}));
        validateDate(event.target.value);
    }

    const handleMessage = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setValues(prevState => ({...prevState, message: event.target.value}));
        validateMessage(event.target.value);
    }

    const onSubmit = (event: React.FormEvent): void => {
        event.preventDefault();
        console.log(validateAll())
        if (validateAll()) {
            setLoading(true);
            fetch('https://reqres.in/api/users', {
                method: 'POST', body: JSON.stringify({...values}), headers: {'Content-Type': 'application/json'}
            }).then((res) => {
                setLoading(false);
                if (res.ok) {
                    setSuccess(Success.Successful);
                    setValues(initialValues);
                    setTimeout(() => setSuccess(Success.NoRes), 3000);
                } else {
                    setSuccess(Success.Unsuccessful);
                }
            });
        }
    }

    return (
        <div className='App'>
            <form onSubmit={onSubmit}>
                <h3>Form</h3>

                <h5>Name Surname</h5>
                <input type='text' className={errors.name === 'error' ? undefined : 'inputError'} onChange={handleName} value={values.name}/>
                <p className={errors.name === 'error' ? undefined : 'error'}>{errors.name}</p>

                <h5>Email</h5>
                <input type='text' className={errors.email === 'error' ? undefined : 'inputError'} value={values.email} onChange={handleEmail}/>
                <p className={errors.email === 'error' ? undefined : 'error'}>{errors.email}</p>

                <h5>Phone</h5>
                <input type='text' placeholder='+7 (___) ___-__-__' className={errors.phone === 'error' ? 'phone' : 'phone inputError'} value={values.phone} onChange={handlePhone}/>
                <p className={errors.phone === 'error' ? undefined : 'error'}>{errors.phone}</p>

                <h5>Birthday</h5>
                <input type='date' placeholder='Birthday' className={errors.date === 'error' ? undefined : 'inputError'} value={values.date} onChange={handleDate}/>
                <p className={errors.date === 'error' ? undefined : 'error'}>{errors.date}</p>

                <textarea placeholder='Message...' className={errors.message === 'error' ? undefined : 'inputError'} rows={8} onChange={handleMessage} value={values.message} />
                <p className={errors.message === 'error' ? undefined : 'error'}>{errors.message}</p>

                <input type='submit' value='Send' className='button' disabled={!validateAll() && loading}/>
          </form>
            <div className={success === Success.NoRes ? undefined : 'result'}>{success === Success.Successful ? 'Successful!' : 'Unsuccessful! Try Again!'}</div>
        </div>
    );
}

export default App;
