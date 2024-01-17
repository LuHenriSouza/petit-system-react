import { Avatar, Box, Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";
import logo from './../sidebar/img/Petit-logo.png'
import { useEffect, useRef, useState } from "react";
import * as yup from 'yup';

const loginSchema = yup.object().shape({
	email: yup.string().required().email().min(5).max(50),
	password: yup.string().required().min(6),
});

interface ILoginProps {
	children: React.ReactNode;

}

export const Login: React.FC<ILoginProps> = ({ children }) => {

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const passwordInputRef = useRef<HTMLInputElement>(null)
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [email, setEmail] = useState('');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [isLoaded, setIsLoaded] = useState(false);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [password, setPassword] = useState('');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [emailError, setEmailError] = useState('');
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [passwordError, setPasswordError] = useState('');
	const { isAuthenticated, login } = useAuthContext();

	useEffect(() => {
		setIsLoaded(true);
	}, [isAuthenticated]);


	const handleSubmit = async () => {
		setEmailError('');
		setPasswordError('');

		try {
			const data = await loginSchema.validate({ email, password }, { abortEarly: false });
			const result = await login(data.email, data.password);
			if (result == 'Não Autorizado.') {
				setEmailError('Email ou Senha Inválidos');
				setPasswordError('Email ou Senha Inválidos');
			}
		} catch (errors) {
			if (errors instanceof yup.ValidationError) {
				errors.inner.forEach((e) => {
					if (e.path === 'email') {
						setEmailError(e.message);
					} else if (e.path === 'password') {
						setPasswordError(e.message);
					}
				});
			}
		}
	};


	const handleKeyDownEmail = (e: React.KeyboardEvent<HTMLDivElement>) => {
		setEmailError('');
		if (e.code === 'Enter' || e.key === 'Enter') {

			passwordInputRef.current?.focus();
		}

	}

	const handleKeyDownPassword = (e: React.KeyboardEvent<HTMLDivElement>) => {
		setPasswordError('');
		if (e.code === 'Enter' || e.key === 'Enter') handleSubmit();
	}

	return (!isLoaded ? <>CARREGANDO</> : !isAuthenticated ?
		<Box
			height={'100vh'}
			display={'flex'}
			alignItems={'center'}
			justifyContent={'center'}
			flexDirection={'column'}
			gap={5}
			sx={{ backgroundColor: 'rgb(28, 37, 54)' }}
		>
			<Avatar src={logo} sx={{ height: 160, width: 160 }}></Avatar>

			<Card sx={{ backgroundColor: '#fff' }}>
				<CardContent>
					<Box display={'flex'} flexDirection={'column'} gap={3} width={300}>
						<Typography variant="h5" align="center">
							Login
						</Typography>
						<TextField
							error={!!emailError}
							onChange={e => setEmail(e.target.value)}
							value={email}
							label="Email"
							type="email"
							helperText={emailError}
							onKeyDown={(e) => handleKeyDownEmail(e)}
						/>
						<TextField
							error={!!passwordError}
							onChange={e => setPassword(e.target.value)}
							value={password}
							label="Senha"
							type="password"
							helperText={passwordError}
							onKeyDown={(e) => handleKeyDownPassword(e)}
							inputRef={passwordInputRef}
						/>
					</Box>
				</CardContent>
				<CardActions>
					<Box width={'100%'} display={'flex'} justifyContent={'center'} sx={{ mb: 1 }}>
						<Button variant="contained" onClick={handleSubmit} size="large">
							Entrar
						</Button>
					</Box>
				</CardActions>
			</Card>
		</Box>
		:
		<>{children}</>
	);
};