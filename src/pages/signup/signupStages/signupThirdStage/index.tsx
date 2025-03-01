import { useState, useCallback, useEffect, useMemo, memo } from 'react'
import { toast } from 'react-toastify'
import { Form } from 'common/components/form'
import { Input } from 'common/components/input'
import { StyledButton } from 'common/styled/styledButton'
import { StyledP } from 'common/styled/styledP'
import { StyledFlexContainer } from 'common/styled/styledFlexContainer'
import { maxLength, onlyNumbers, requiredField } from 'utils/validators'
import { COLORS } from 'utils/constants'

interface SignupThirdStageProps {
  onSubmitHandler: () => void
}

const maxLenght4 = maxLength(4)

export const SignupThirdStage = memo(
  ({ onSubmitHandler }: SignupThirdStageProps) => {
    const [counter, setCounter] = useState(30)

    const validate = useCallback((inputName: string, inputValue: string) => {
      const errors: Record<string, string | null> = {}

      if (inputName === 'code') {
        const validateResults = [requiredField, onlyNumbers, maxLenght4]
          .map((validate) => validate(inputValue))
          .filter((error) => error)

        errors.code = validateResults[0]
      }

      return errors
    }, [])

    const onResendHandler = () => {
      setCounter(30)
      toast.success('Код отправлен снова')
    }

    useEffect(() => {
      if (counter > 0) {
        const timer = setInterval(() => setCounter(counter - 1), 1000)

        return () => clearInterval(timer)
      }
    }, [counter])

    const initialValues = useMemo(
      () => ({
        code: null,
      }),
      []
    )

    return (
      <Form initialValues={initialValues} validate={validate}>
        {({ values, errors, isFormValid }) => (
          <StyledFlexContainer column gap="0.5rem">
            <Input
              label="Код из СМС"
              name="code"
              value={values.code}
              error={errors.code}
              cypressName="code"
            />

            {counter ? (
              <StyledP color={COLORS.GRAY}>
                Отправить код повторно можно через {counter} секунд
              </StyledP>
            ) : (
              <StyledP
                color={COLORS.PRIMARY}
                cursor="pointer"
                onClick={onResendHandler}
              >
                Отправить код повторно
              </StyledP>
            )}

            <StyledFlexContainer
              column
              alignItems="center"
              padding="0.5rem 0 0 0"
            >
              <StyledButton
                type="button"
                color={isFormValid ? COLORS.PRIMARY : COLORS.GRAY}
                padding="0.5rem 1rem"
                disabled={!isFormValid}
                onClick={onSubmitHandler}
                data-cy="submitSignup"
              >
                Зарегистрироваться
              </StyledButton>
            </StyledFlexContainer>
          </StyledFlexContainer>
        )}
      </Form>
    )
  }
)
