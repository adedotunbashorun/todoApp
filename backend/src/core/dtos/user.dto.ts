import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSignupDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         fullName:
 *           type: string
 *           description: The full name of the user
 */
export class UserSignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName?: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserSigninDto:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 */
export class UserSigninDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
