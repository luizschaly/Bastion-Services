import { execSync } from 'child_process';

try {
    // Clear the build directory
    execSync('rm -rf build', { stdio: 'inherit' });

    // Compile TypeScript files
    execSync('tsc --build', { stdio: 'inherit' });

    // Run the compiled output
    execSync('node build/index.js', { stdio: 'inherit' });
} catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
}
