import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { Button } from "#ui/button";

const MotionButtonBase = motion.create(Button);

export function MotionButton(props: ComponentProps<typeof MotionButtonBase>) {
	return (
		<MotionButtonBase
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.97 }}
			transition={{ type: "spring", bounce: 0.6 }}
			{...props}
		/>
	);
}
