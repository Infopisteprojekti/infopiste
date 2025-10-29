import '../setup/mockReactPdf.jsx';
import '../setup/mockResizeObserver.js';
import '../setup/mockExactumSvg.jsx';
import i18n from '../setup/i18nTest.js';

import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { MemoryRouter } from 'react-router-dom';
import App from '../../src/App';

describe('App - Language Switching', () => {
  test('changes language from English to Finnish', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(i18n, 'changeLanguage');

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('Floor Plan')).toBeInTheDocument();

    const langDropDown = await screen.findByText('EN');
    await user.click(langDropDown);

    const finnishOption = await screen.findByText('Suomi');
    await user.click(finnishOption);

    expect(spy).toHaveBeenCalledWith('fi');
    expect(await screen.findByText('Kartta')).toBeInTheDocument();
  });
});
