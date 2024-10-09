export const nToBRL = (value: number | undefined | null) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export const BRLToN = (string: string) => {
    const getNumbers = string.replace(/[^\d,.-]/g, '');
    return Number(getNumbers.replace('.', '').replace(',', '.'));
}