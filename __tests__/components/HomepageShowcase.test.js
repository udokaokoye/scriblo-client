import React from "react";
import {render, screen} from "@testing-library/react";
import HomepageShowcase from "@/Components/HomepageShowcase";
import '@testing-library/jest-dom';
// import { getSession } from "next-auth/client";



describe("RecentArticles", () => {
    test("renders HomepageShowcase component", () => {
        render(<HomepageShowcase />);
        const header = screen.getByRole('heading');
        expect(header).toHaveTextContent('Stay Curious.');
    });
    }
)