import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import BaseTerms from "./base-terms";

const meta: Meta<typeof BaseTerms> = {
  title: "Design Library/Molecules/Content/Terms/BaseTerms",
  component: BaseTerms,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof BaseTerms>;

const baseArgs = {
  title: "Terms of Service",
  subtitle: "Please read these terms carefully before using our service.",
  updated: "Last updated: Jan 1, 2025",
  content:
    "By accessing or using the service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the service.",
  // extraStyles defaults to true in the component
};

export const Default: Story = {
  args: {
    ...baseArgs,
  },
};

export const WithActions: Story = {
  args: {
    ...baseArgs,
    onArrowBack: action("onArrowBack"),
    onAgreeTerms: action("onAgreeTerms"),
  },
};

export const NoHeader: Story = {
  args: {
    ...baseArgs,
    noHeader: true,
  },
};

export const WithoutExtraStyles: Story = {
  args: {
    ...baseArgs,
    extraStyles: false,
  },
};

export const LongContent: Story = {
  args: {
    ...baseArgs,
    content:
      "These terms apply to all visitors, users and others who access or use the service. " +
      "You are responsible for safeguarding the password that you use to access the service. " +
      "You agree not to disclose your password to any third party. " +
      "Accounts may be terminated for violations of these terms. " +
      "We may terminate or suspend access to our service immediately, without prior notice or liability, " +
      "for any reason whatsoever, including without limitation if you breach the terms. " +
      "The service and its original content, features and functionality are and will remain the exclusive " +
      "property of the company and its licensors. " +
      "We reserve the right, at our sole discretion, to modify or replace these terms at any time.",
  },
};
