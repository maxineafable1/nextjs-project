import InputForm from "@/components/input-form";
import { Props } from "./email";

export default function Terms({ register, errors }: Props) {
  return (
    <div className="grid gap-1 mt-8">
      <label className='flex items-start gap-4 text-sm bg-neutral-800 rounded p-4'>
        <InputForm
          id="terms"
          name="terms"
          type="checkbox"
          register={register}
        />
        I agree to the Spotify Terms and Conditions of Use and Privacy Policy.
      </label>
      {errors && <p className="text-sm text-red-400 mt-1">{errors.message}</p>}
    </div>
  )
}
