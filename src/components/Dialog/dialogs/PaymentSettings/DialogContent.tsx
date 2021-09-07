import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from '@material-ui/core'
import { useAppDispatch } from 'store/hooks'
import { DialogProps } from 'components/Dialog'
import RemoveIcon from '@material-ui/icons/Delete'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { useAppSelector } from 'store/hooks'
import { setPaymentSettings, SettingsState } from 'store/slices/settings'
import { DevTool } from '@hookform/devtools'

export default function PaymentSettingsDialogContent({
  onSubmit,
  onDissmiss,
}: Pick<DialogProps, 'onDissmiss' | 'onSubmit'>) {
  const dispatch = useAppDispatch()
  const paymentSettings = useAppSelector((state) => state.settings.payment)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsState['payment']>({ defaultValues: paymentSettings })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pointers',
  })

  const onSubmitForm: SubmitHandler<SettingsState['payment']> = (data) => {
    dispatch(setPaymentSettings(data))
    // close modal
    onSubmit()
  }

  const onSaveClick = () => {
    handleSubmit(onSubmitForm)()
  }

  const accessCode = register('accessCode')

  return (
    <>
      <DialogTitle id="alert-dialog-title">Payment Settings</DialogTitle>

      <DialogContent>
        <DevTool control={control} placement="bottom-left" />
        <Typography variant="h3" color="textSecondary" gutterBottom>
          Live Payment
        </Typography>
        <Typography gutterBottom>
          To receive live payments while a viewer engages with your content,
          please add your walletʼ s information below. To split payments between
          multiple pointers, add additional pointers below and indicate the
          percentage of payments (out of 100) to be received by each pointer.
          Please note that Mural received 10% of all payments.
        </Typography>
        <Box my={4}>
          {fields.map((field, index) => {
            const name = register(`pointers.${index}.name`, {
              required: index > 0 ? 'Required' : undefined,
            })
            const pointer = register(`pointers.${index}.pointer`, {
              required: index > 0 ? 'Required' : undefined,
            })
            const share = register(`pointers.${index}.share`, {
              required: index > 0 ? 'Required' : undefined,
              max: 100,
              min: 0,
            })
            return (
              <Box key={field.id} display="flex" mb={4}>
                <TextField
                  label="Name"
                  placeholder="Editorial Team"
                  key={`pointers.${index}.name`}
                  inputRef={name.ref}
                  onChange={name.onChange}
                  onBlur={name.onBlur}
                  name={name.name}
                  style={{ marginRight: 10 }}
                  required={index > 0}
                  error={errors.pointers && !!errors.pointers[index]?.name}
                  helperText={
                    errors?.pointers && errors.pointers[index]?.name?.message
                  }
                />
                <TextField
                  label="Pointer"
                  placeholder="$ilp.gatehub.net/XXXXXXXX"
                  key={`pointers.${index}.pointer`}
                  inputRef={pointer.ref}
                  onChange={pointer.onChange}
                  onBlur={pointer.onBlur}
                  name={pointer.name}
                  style={{ marginRight: 10, flexGrow: 1 }}
                  required={index > 0}
                  error={errors.pointers && !!errors.pointers[index]?.pointer}
                  helperText={
                    errors?.pointers && errors.pointers[index]?.pointer?.message
                  }
                />
                <TextField
                  label="Share"
                  placeholder="100"
                  type="number"
                  inputProps={{
                    min: 0,
                    max: 100,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  inputRef={share.ref}
                  onChange={share.onChange}
                  onBlur={share.onBlur}
                  name={share.name}
                  required={index > 0}
                  error={errors.pointers && !!errors.pointers[index]?.share}
                  helperText={
                    errors?.pointers && errors.pointers[index]?.share?.message
                  }
                  style={{ maxWidth: 120 }}
                />
                {fields.length > 1 && (
                  <IconButton onClick={() => remove(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </Box>
            )
          })}
        </Box>
        <Box my={4}>
          <Button onClick={() => append({})} variant="contained">
            Add a pointer
          </Button>
        </Box>

        <Typography gutterBottom>
          If you donʼt currently have a wallet, you can set one up quickly and
          easily. First, please set up your account on Coil. Then fetch your
          Payment Pointer.
        </Typography>
        <Box my={4}>
          <Box mr={10} component="span">
            <Link target="_blank" href="https://coil.com/">
              Set Up Coil
            </Link>
          </Box>
          <Link
            // variant=""
            target="_blank"
            href="https://webmonetization.org/docs/ilp-wallets/"
          >
            Fetch Pointer
          </Link>
        </Box>

        <Box my={4}>
          <Typography variant="h3" color="textSecondary" gutterBottom>
            Access Code
          </Typography>
          <Typography gutterBottom>
            Create a unique code below (12-15 characters) to allow subscribers
            from your donation and subscription services (Patreon, Ko-Fi,
            PayPal, etc.) to access paid content. You can share this code with
            your funders and subscribers on these services, or by email.
          </Typography>
        </Box>
        <Box my={4}>
          <TextField
            label="Your access code"
            placeholder="yzYCMJWlFfHgzQ"
            inputRef={accessCode.ref}
            onChange={accessCode.onChange}
            onBlur={accessCode.onBlur}
            name={accessCode.name}
            error={!!errors?.accessCode}
            helperText={errors?.accessCode && errors?.accessCode.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDissmiss}>Cancel</Button>
        <Button onClick={onSaveClick}>Ok</Button>
      </DialogActions>
    </>
  )
}
