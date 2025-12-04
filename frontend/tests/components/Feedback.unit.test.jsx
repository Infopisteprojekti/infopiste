import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Feedback from '../../src/components/Feedback.jsx';
import userEvent from '@testing-library/user-event';

describe('Feedback unit tests', () => {
    const setup = () => {
        render(<Feedback />);
    };

    test('give feedback button opens and show correct information', async () => {
        setup();
        const user = userEvent.setup();

        const feedbackButton = await screen.findByText('Give feedback');
        await user.click(feedbackButton);
        console.log(feedbackButton)

        const popup = document.getElementById('feedback-popup');
        expect(popup.classList.contains('hidden')).toBe(false);
        expect(await screen.findByText('Give feedback via email to ashwin.rao@helsinki.fi')).toBeInTheDocument();
    })
})