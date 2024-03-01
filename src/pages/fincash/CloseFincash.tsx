import { Box, Button, Paper, Typography } from "@mui/material";
import { LayoutMain } from "../../shared/layouts";
import { VForm } from "../../shared/forms/VForm";
import { VTextField } from "../../shared/forms/VTextField";
import React, { useEffect, useRef, useState } from "react";
import { FormHandles } from "@unform/core";
import SportsScoreRoundedIcon from '@mui/icons-material/SportsScoreRounded';
import Swal from "sweetalert2";
import { FincashService, IFincash } from "../../shared/services/api";
import { useNavigate } from "react-router-dom";

interface IFinishParams {
	FinalTotalValue: string
}

export const CloseFincash: React.FC = () => {
	const formValueRef = useRef<FormHandles>(null);
	const formCalcRef = useRef<FormHandles>(null);

	// -----------------------CALC INPUT REFS-------------------------------
	const input010 = useRef<HTMLInputElement>(null);
	const input025 = useRef<HTMLInputElement>(null);
	const input050 = useRef<HTMLInputElement>(null);
	const input1 = useRef<HTMLInputElement>(null);
	const input2 = useRef<HTMLInputElement>(null);
	const input5 = useRef<HTMLInputElement>(null);
	const input10 = useRef<HTMLInputElement>(null);
	const input20 = useRef<HTMLInputElement>(null);
	const input50 = useRef<HTMLInputElement>(null);
	const input100 = useRef<HTMLInputElement>(null);
	const input200 = useRef<HTMLInputElement>(null);
	// -----------------------CALC INPUT REFS-------------------------------

	const navigate = useNavigate();

	const [fincash, setFincash] = useState<IFincash>();
	const [totalValue, setTotalValue] = useState('0.00');
	const [denominationValues, setDenominationValues] = useState(
		{
			'0.05': 0,
			'0.10': 0,
			'0.25': 0,
			'0.50': 0,
			'1.00': 0,
			'2.00': 0,
			'5.00': 0,
			'10.00': 0,
			'20.00': 0,
			'50.00': 0,
			'100.00': 0,
			'200.00': 0,
		}
	);

	useEffect(() => {
		const fetchData = async () => {
			const fincashFetch = await FincashService.getOpenFincash();
			if (fincashFetch instanceof Error) {
				Swal.fire({
					icon: "error",
					title: "Erro",
					text: "Nenhum caixa aberto encontrado!",
					showConfirmButton: true,
				});
				navigate('/caixa/novo');
			} else {
				setFincash(fincashFetch)
			}
		}
		fetchData();
	}, [navigate]);

	const calculateTotalValue = (updatedValues: Record<string, number>) => {
		let total = 0;
		for (const [denomination, quantity] of Object.entries(updatedValues)) {
			total += parseFloat(denomination) * quantity;
		}
		return total.toFixed(2); // Fixed to 2 decimal places for currency
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, denomination: string) => {
		const inputValue = Math.abs(parseInt(e.target.value, 10)) || 0;
		setDenominationValues(prevValues => {
			const updatedValues = {
				...prevValues,
				[denomination]: inputValue,
			};
			const totalValue = calculateTotalValue(updatedValues);
			setTotalValue(totalValue);
			return updatedValues;
		});
	}

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLDivElement>,
		nextInputRef?: React.RefObject<HTMLInputElement>
	) => {
		if (nextInputRef) {
			if ((e.key === "Enter" || e.code === "Enter") && nextInputRef.current) {
				nextInputRef.current.focus();
			}
		} else {
			if (e.key === "Enter" || e.code === "Enter") formCalcRef.current?.submitForm();
		}
	};

	const handleSubmitValue = async (data: IFinishParams) => {
		const getNumbers = data.FinalTotalValue.split(' ');
		const value = getNumbers[1];
		Swal.fire({
			title: 'Fechar Caixa',
			text: `Tem certeza que deseja fechar o caixa com "R$ ${value}" ?`,
			icon: 'warning',
			allowEnterKey: false,
			showCancelButton: true,
			cancelButtonColor: '#aaa',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Confirmar',
		}).then((result) => {
			if (result.isConfirmed) {
				if (fincash) {
					FincashService.finish(fincash.id, Number(value)).then((result) => {
						if (result instanceof Error) {
							alert(result.message);
						} else {
							Swal.fire({
								title: 'Finalizado!',
								text: 'Caixa Finalizado com sucesso !',
								icon: 'success',
							});
							navigate('/caixa/novo');
						}
					});
				}
			}
		});
	}

	const handleSubmitCalc = async () => {
		const updatedTotalValue = calculateTotalValue(denominationValues);

		Swal.fire({
			title: 'Fechar Caixa',
			text: `Tem certeza que deseja fechar o caixa com "R$ ${updatedTotalValue}" ?`,
			icon: 'warning',
			allowEnterKey: false,
			showCancelButton: true,
			cancelButtonColor: '#aaa',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Confirmar'
		}).then((result) => {
			if (result.isConfirmed) {
				if (fincash) {
					FincashService.finish(fincash.id, Number(updatedTotalValue)).then((result) => {
						if (result instanceof Error) {
							alert(result.message);
						} else {
							Swal.fire({
								title: 'Finalizado!',
								text: 'Caixa Finalizado com sucesso !',
								icon: 'success',
							});
							navigate('/caixa/novo');
						}
					});
				}
			}
		});
	}

	return (
		<LayoutMain title="Fechamentos" subTitle="Feche o caixa">
			<Box display={'flex'} gap={2}>
				<Paper sx={{ backgroundColor: '#fff', px: 3, py: 1, mr: 5, width: '50%' }} variant="elevation">
					<VForm onSubmit={handleSubmitValue} placeholder={''} ref={formValueRef}>
						<Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
							<Typography variant="h4" fontWeight={'bold'} mt={5} ml={5}>
								Valor Final
							</Typography>
							<Box display={'flex'} gap={5} justifyContent={'center'} maxWidth={'100%'} m={5} mb={8}>
								<VTextField name="FinalTotalValue" fullWidth={false} cash valueDefault="R$ 0.00" />
								<Button
									variant="contained"
									onClick={() => formValueRef.current?.submitForm()}
									sx={{ minHeight: 35, minWidth: 110 }}
								>
									<SportsScoreRoundedIcon sx={{ mr: 1 }} />
									Fechar Caixa
								</Button>
							</Box>
						</Box>
					</VForm>
				</Paper>
				<Typography variant="h4" fontWeight={'bold'} mr={5} mt={25}>
					OU
				</Typography>
				<Paper sx={{ backgroundColor: '#fff', px: 3, py: 1, mr: 5, width: '50%' }} variant="elevation">
					<VForm onSubmit={handleSubmitCalc} placeholder={''} ref={formCalcRef}>
						<Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
							<Typography variant="h4" fontWeight={'bold'} mt={5} ml={5}>
								Calculadora
							</Typography>

							<Box m={3} display={'flex'} justifyContent={'center'} gap={10}>
								<Box>
									<Box display={'flex'} flexDirection={'column'} gap={1}>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 0.05</Typography>
											<VTextField onChange={(e) => handleChange(e, '0.05')} name="0.05" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} onKeyDown={(e) => handleKeyDown(e, input010)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 0.10</Typography>
											<VTextField onChange={(e) => handleChange(e, '0.10')} name="0.10" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input010} onKeyDown={(e) => handleKeyDown(e, input025)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 0.25</Typography>
											<VTextField onChange={(e) => handleChange(e, '0.25')} name="0.25" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input025} onKeyDown={(e) => handleKeyDown(e, input050)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 0.50</Typography>
											<VTextField onChange={(e) => handleChange(e, '0.50')} name="0.50" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input050} onKeyDown={(e) => handleKeyDown(e, input1)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 1.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '1.00')} name="1.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input1} onKeyDown={(e) => handleKeyDown(e, input2)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 2.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '2.00')} name="2.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input2} onKeyDown={(e) => handleKeyDown(e, input5)} />
										</Box>
									</Box>
								</Box>
								<Box>
									<Box display={'flex'} flexDirection={'column'} gap={1}>

										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 5.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '5.00')} name="5.00" sx={{ maxWidth: 100, ml: 2 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input5} onKeyDown={(e) => handleKeyDown(e, input10)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 10.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '10.00')} name="10.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input10} onKeyDown={(e) => handleKeyDown(e, input20)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 20.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '20.00')} name="20.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input20} onKeyDown={(e) => handleKeyDown(e, input50)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 50.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '50.00')} name="50.00" sx={{ maxWidth: 100, ml: 1 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input50} onKeyDown={(e) => handleKeyDown(e, input100)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 100.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '100.00')} name="100.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input100} onKeyDown={(e) => handleKeyDown(e, input200)} />
										</Box>
										<Box display={'flex'} gap={1} alignItems={'center'}>
											<Typography>R$ 200.00</Typography>
											<VTextField onChange={(e) => handleChange(e, '200.00')} name="200.00" sx={{ maxWidth: 100 }} inputProps={{ type: 'number' }} autoComplete="off" valueDefault={undefined} inputRef={input200} onKeyDown={(e) => handleKeyDown(e)} />
										</Box>
									</Box>
								</Box>
							</Box>
							<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={0} m={2} ml={8} mr={12} mt={4} maxWidth={'100%'}>
								<Typography variant="h5">Total: R$ {totalValue}</Typography>
								<Button
									variant="contained"
									onClick={() => formCalcRef.current?.submitForm()}
									sx={{ minHeight: 45, minWidth: 110 }}
								>
									<SportsScoreRoundedIcon sx={{ mr: 1 }} />
									Fechar Caixa
								</Button>
							</Box>
						</Box>
					</VForm>
				</Paper>
			</Box>
		</LayoutMain >
	);
};