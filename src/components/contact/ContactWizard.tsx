'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Section, Container } from '../layout/Container';
import SuccessModal from './SuccessModal';

// Validation Schemas
const step1Schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    company: z.string().optional(),
});

const step2Schema = z.object({
    projectType: z.string().min(1, 'Please select a project type'),
    budget: z.string().min(1, 'Please select a budget range'),
});

const step3Schema = z.object({
    description: z.string().min(10, 'Please tell us more about your project'),
    timeline: z.string().optional(),
});

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema>;

const WizardWrapper = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  display: flex;
  align-items: center;
`;

const FormContainer = styled(Container)`
  max-width: 800px;
`;

const ProgressBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
    transform: translateY(-50%);
  }
`;

const ProgressStep = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $active, $completed, theme }) =>
        $active || $completed ? theme.colors.gold : theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, $completed, theme }) =>
        $active || $completed ? theme.colors.background : theme.colors.gold};
  font-weight: 600;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
`;

const FormTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 300;
`;

const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gold};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gold};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.03);
  color: ${({ theme }) => theme.colors.text};
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gold};
  }
`;

const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background-color: ${({ $variant, theme }) =>
        $variant === 'secondary' ? 'transparent' : theme.colors.gold};
  color: ${({ $variant, theme }) =>
        $variant === 'secondary' ? theme.colors.gold : theme.colors.background};
  border: ${({ $variant, theme }) =>
        $variant === 'secondary' ? `1px solid ${theme.colors.gold}` : 'none'};
  border-radius: 0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $variant, theme }) =>
        $variant !== 'secondary' ? `0 4px 12px rgba(212, 175, 55, 0.2)` : 'none'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function ContactWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<FormData>({
        resolver: zodResolver(
            step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema
        ) as any,
        defaultValues: {
            name: '',
            email: '',
            company: '',
            projectType: '',
            budget: '',
            description: '',
            timeline: '',
            ...formData,
        },
        mode: 'onChange',
        shouldUnregister: false,
    });

    const onNext = async () => {
        const isValid = await trigger();
        if (isValid) {
            setStep((prev) => prev + 1);
        }
    };

    const onPrev = () => {
        setStep((prev) => prev - 1);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const finalData = { ...formData, ...data };
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(finalData),
            });

            if (response.ok) {
                setShowSuccessModal(true);
                // Optional: Reset form or redirect
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <WizardWrapper id="contact">
            <FormContainer>
                <FormTitle>Start Your Journey</FormTitle>

                <ProgressBar>
                    {[1, 2, 3].map((s) => (
                        <ProgressStep key={s} $active={step === s} $completed={step > s}>
                            {s}
                        </ProgressStep>
                    ))}
                </ProgressBar>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <InputGroup>
                                    <Label>Name</Label>
                                    <Input {...register('name')} placeholder="John Doe" />
                                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Email</Label>
                                    <Input {...register('email')} placeholder="john@example.com" />
                                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Company (Optional)</Label>
                                    <Input {...register('company')} placeholder="Your Company Ltd." />
                                </InputGroup>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <InputGroup>
                                    <Label>Project Type</Label>
                                    <Select {...register('projectType')}>
                                        <option value="">Select a type...</option>
                                        <option value="website">Website Design & Dev</option>
                                        <option value="ecommerce">E-Commerce</option>
                                        <option value="webapp">Web Application</option>
                                        <option value="branding">Branding & Identity</option>
                                    </Select>
                                    {errors.projectType && (
                                        <ErrorMessage>{errors.projectType.message}</ErrorMessage>
                                    )}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Budget Range</Label>
                                    <Select {...register('budget')}>
                                        <option value="">Select a range...</option>
                                        <option value="5k-10k">$5,000 - $10,000</option>
                                        <option value="10k-25k">$10,000 - $25,000</option>
                                        <option value="25k-50k">$25,000 - $50,000</option>
                                        <option value="50k+">$50,000+</option>
                                    </Select>
                                    {errors.budget && <ErrorMessage>{errors.budget.message}</ErrorMessage>}
                                </InputGroup>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <InputGroup>
                                    <Label>Project Details</Label>
                                    <TextArea
                                        {...register('description')}
                                        placeholder="Tell us about your goals, requirements, and vision..."
                                    />
                                    {errors.description && (
                                        <ErrorMessage>{errors.description.message}</ErrorMessage>
                                    )}
                                </InputGroup>
                                <InputGroup>
                                    <Label>Timeline (Optional)</Label>
                                    <Input {...register('timeline')} placeholder="e.g. 3 months" />
                                </InputGroup>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ButtonGroup>
                        {step > 1 && (
                            <Button type="button" $variant="secondary" onClick={onPrev}>
                                Back
                            </Button>
                        )}
                        {step < 3 ? (
                            <Button type="button" onClick={onNext} style={{ marginLeft: 'auto' }}>
                                Next Step
                            </Button>
                        ) : (
                            <Button type="submit" style={{ marginLeft: 'auto' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Submit Request'}
                            </Button>
                        )}
                    </ButtonGroup>
                </form>
            </FormContainer>
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    setStep(1);
                    setFormData({});
                    // Ideally reset the react-hook-form too, but this is a good start
                    window.location.reload(); // Simple way to reset everything for now
                }}
            />
        </WizardWrapper>
    );
}
