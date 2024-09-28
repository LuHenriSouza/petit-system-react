import React from 'react';
import { Form } from '@unform/web';
import { SubmitHandler, FormHandles } from '@unform/core';

interface IProps {
    children: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: SubmitHandler<any>;
    placeholder?: unknown;
}

// Usando forwardRef para garantir o tipo do `ref`
export const VForm = React.forwardRef<FormHandles, IProps>(({ children, onSubmit, placeholder }, ref) => {
    return (
        <Form ref={ref} onSubmit={onSubmit} onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }} placeholder={placeholder}>
            {children}
        </Form>
    );
});
